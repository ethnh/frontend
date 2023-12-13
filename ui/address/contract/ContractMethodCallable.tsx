import { Box, Button, chakra, Flex, Grid, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { MethodFormFields, ContractMethodCallResult } from './types';
import type { SmartContractMethodInput, SmartContractMethod } from 'types/api/contract';

import arrowIcon from 'icons/arrows/down-right.svg';
import * as mixpanel from 'lib/mixpanel/index';

import ContractMethodCallableRow from './ContractMethodCallableRow';
import { formatFieldValues, transformFieldsToArgs } from './utils';

interface ResultComponentProps<T extends SmartContractMethod> {
  item: T;
  result: ContractMethodCallResult<T>;
  onSettle: () => void;
}

interface Props<T extends SmartContractMethod> {
  data: T;
  onSubmit: (data: T, args: Array<string | Array<unknown>>) => Promise<ContractMethodCallResult<T>>;
  resultComponent: (props: ResultComponentProps<T>) => JSX.Element | null;
  isWrite?: boolean;
}

// groupName%groupIndex:inputName%inputIndex
const getFormFieldName = (input: { index: number; name: string }, group?: { index: number; name: string }) =>
  `${ group ? `${ group.name }%${ group.index }:` : '' }${ input.name || 'input' }%${ input.index }`;

const ContractMethodCallable = <T extends SmartContractMethod>({ data, onSubmit, resultComponent: ResultComponent, isWrite }: Props<T>) => {

  const [ result, setResult ] = React.useState<ContractMethodCallResult<T>>();
  const [ isLoading, setLoading ] = React.useState(false);

  const inputs: Array<SmartContractMethodInput> = React.useMemo(() => {
    return [
      ...('inputs' in data ? data.inputs : []),
      ...('stateMutability' in data && data.stateMutability === 'payable' ? [ {
        name: 'value',
        type: 'uint256' as const,
        internalType: 'uint256' as const,
      } ] : []),
    ];
  }, [ data ]);

  const formApi = useForm<MethodFormFields>({
    mode: 'onBlur',
  });

  const handleTxSettle = React.useCallback(() => {
    setLoading(false);
  }, []);

  const handleFormChange = React.useCallback(() => {
    result && setResult(undefined);
  }, [ result ]);

  const onFormSubmit: SubmitHandler<MethodFormFields> = React.useCallback(async(formData) => {
    const formattedData = formatFieldValues(formData, inputs);
    const args = transformFieldsToArgs(formattedData);

    setResult(undefined);
    setLoading(true);

    onSubmit(data, args)
      .then((result) => {
        setResult(result);
      })
      .catch((error) => {
        setResult(error?.error || error?.data || (error?.reason && { message: error.reason }) || error);
        setLoading(false);
      })
      .finally(() => {
        mixpanel.logEvent(mixpanel.EventTypes.CONTRACT_INTERACTION, {
          'Method type': isWrite ? 'Write' : 'Read',
          'Method name': 'name' in data ? data.name : 'Fallback',
        });
      });
  }, [ inputs, onSubmit, data, isWrite ]);

  return (
    <Box>
      <FormProvider { ...formApi }>
        <chakra.form
          noValidate
          onSubmit={ formApi.handleSubmit(onFormSubmit) }
          onChange={ handleFormChange }
        >
          <Grid
            columnGap={ 3 }
            rowGap={{ base: 2, lg: 3 }}
            gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 250px) minmax(0, 1fr)' }}
            mb={ 3 }
            _empty={{ display: 'none' }}
          >
            { inputs.map((input, index) => {
              const fieldName = getFormFieldName({ name: input.name, index });

              if (input.type === 'tuple' && input.components) {
                return (
                  <React.Fragment key={ fieldName }>
                    { index !== 0 && <><Box h={{ base: 0, lg: 3 }}/><div/></> }
                    <Box
                      fontWeight={ 500 }
                      lineHeight="20px"
                      py={{ lg: '6px' }}
                      fontSize="sm"
                      wordBreak="break-word"
                    >
                      { input.name } ({ input.type })
                    </Box>
                    <div/>
                    { input.components.map((component, componentIndex) => {
                      const fieldName = getFormFieldName(
                        { name: component.name, index: componentIndex },
                        { name: input.name, index },
                      );

                      return (
                        <ContractMethodCallableRow
                          key={ fieldName }
                          fieldName={ fieldName }
                          argName={ component.name }
                          argType={ component.type }
                          isDisabled={ isLoading }
                          onChange={ handleFormChange }
                          isGrouped
                        />
                      );
                    }) }
                    { index !== inputs.length - 1 && <><Box h={{ base: 0, lg: 3 }}/><div/></> }
                  </React.Fragment>
                );
              }

              return (
                <ContractMethodCallableRow
                  key={ fieldName }
                  fieldName={ fieldName }
                  argName={ input.name }
                  argType={ input.type }
                  isDisabled={ isLoading }
                  onChange={ handleFormChange }
                />
              );
            }) }
          </Grid>
          <Button
            isLoading={ isLoading }
            loadingText={ isWrite ? 'Write' : 'Read' }
            variant="outline"
            size="sm"
            flexShrink={ 0 }
            width="min-content"
            px={ 4 }
            type="submit"
          >
            { isWrite ? 'Write' : 'Read' }
          </Button>
        </chakra.form>
      </FormProvider>
      { 'outputs' in data && !isWrite && data.outputs.length > 0 && (
        <Flex mt={ 3 } fontSize="sm">
          <Icon as={ arrowIcon } boxSize={ 5 } mr={ 1 }/>
          <Text>{ data.outputs.map(({ type, name }) => [ name, type ].join(' ')).join(', ') }</Text>
        </Flex>
      ) }
      { result && <ResultComponent item={ data } result={ result } onSettle={ handleTxSettle }/> }
    </Box>
  );
};

export default React.memo(ContractMethodCallable) as typeof ContractMethodCallable;
