import { Button, chakra, useUpdateEffect } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields } from './types';
import type { SocketMessage } from 'lib/socket/types';
import type { SmartContractVerificationMethod, SmartContractVerificationConfig } from 'types/api/contract';

import useApiFetch from 'lib/api/useApiFetch';
import useToast from 'lib/hooks/useToast';
import link from 'lib/link/link';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import ContractVerificationFieldMethod from './fields/ContractVerificationFieldMethod';
import ContractVerificationFlattenSourceCode from './methods/ContractVerificationFlattenSourceCode';
import ContractVerificationMultiPartFile from './methods/ContractVerificationMultiPartFile';
import ContractVerificationSourcify from './methods/ContractVerificationSourcify';
import ContractVerificationStandardInput from './methods/ContractVerificationStandardInput';
import ContractVerificationVyperContract from './methods/ContractVerificationVyperContract';
import ContractVerificationVyperMultiPartFile from './methods/ContractVerificationVyperMultiPartFile';
import { prepareRequestBody, formatSocketErrors, DEFAULT_VALUES } from './utils';

const METHOD_COMPONENTS = {
  'flattened-code': <ContractVerificationFlattenSourceCode/>,
  'standard-input': <ContractVerificationStandardInput/>,
  sourcify: <ContractVerificationSourcify/>,
  'multi-part': <ContractVerificationMultiPartFile/>,
  'vyper-code': <ContractVerificationVyperContract/>,
  'vyper-multi-part': <ContractVerificationVyperMultiPartFile/>,
};

interface Props {
  method?: SmartContractVerificationMethod;
  config: SmartContractVerificationConfig;
  hash: string;
}

const ContractVerificationForm = ({ method: methodFromQuery, config, hash }: Props) => {
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: methodFromQuery ? DEFAULT_VALUES[methodFromQuery] : undefined,
  });
  const { control, handleSubmit, watch, formState, setError, reset } = formApi;
  const submitPromiseResolver = React.useRef<(value: unknown) => void>();

  const apiFetch = useApiFetch();
  const toast = useToast();
  const router = useRouter();

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    const body = prepareRequestBody(data);

    try {
      await apiFetch('contract_verification_via', {
        pathParams: { method: data.method.value, id: hash.toLowerCase() },
        fetchParams: {
          method: 'POST',
          body,
        },
      });
    } catch (error) {
      return;
    }

    return new Promise((resolve) => {
      submitPromiseResolver.current = resolve;
    });
  }, [ apiFetch, hash ]);

  const handleNewSocketMessage: SocketMessage.ContractVerification['handler'] = React.useCallback((payload) => {
    if (payload.status === 'error') {
      const errors = formatSocketErrors(payload.errors);
      errors.forEach(([ field, error ]) => setError(field, error));
      submitPromiseResolver.current?.(null);
      return;
    }

    toast({
      position: 'top-right',
      title: 'Success',
      description: 'Contract is successfully verified.',
      status: 'success',
      variant: 'subtle',
      isClosable: true,
      onCloseComplete: () => {
        router.push(link('address_index', { id: hash }, { tab: 'contract' }), undefined, { shallow: true });
      },
    });
  }, [ hash, router, setError, toast ]);

  const handleSocketError = React.useCallback(() => {
    if (!formState.isSubmitting) {
      return;
    }

    submitPromiseResolver.current?.(null);

    const toastId = 'socket-error';
    !toast.isActive(toastId) && toast({
      id: toastId,
      position: 'top-right',
      title: 'Error',
      description: 'There was an error with socket connection. Try again later.',
      status: 'error',
      variant: 'subtle',
      isClosable: true,
    });
  // callback should not change when form is submitted
  // otherwise it will resubscribe to channel, but we don't want that since in that case we might miss verification result message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ toast ]);

  const channel = useSocketChannel({
    topic: `addresses:${ hash.toLowerCase() }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: false,
  });
  useSocketMessage({
    channel,
    event: 'verification_result',
    handler: handleNewSocketMessage,
  });

  const method = watch('method');
  const content = METHOD_COMPONENTS[method?.value] || null;
  const methodValue = method?.value;

  useUpdateEffect(() => {
    if (methodValue) {
      reset(DEFAULT_VALUES[methodValue]);
    }
  // !!! should run only when method is changed
  }, [ methodValue ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
      >
        <ContractVerificationFieldMethod
          control={ control }
          methods={ config.verification_options }
          isDisabled={ formState.isSubmitting }
        />
        { content }
        { Boolean(method) && (
          <Button
            variant="solid"
            size="lg"
            type="submit"
            mt={ 12 }
            isLoading={ formState.isSubmitting }
            loadingText="Verify & publish"
          >
            Verify & publish
          </Button>
        ) }
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(ContractVerificationForm);
