import { Alert, Button, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { Fields } from './types';
import type { TokenInfoApplication } from 'types/api/account';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import useToast from 'lib/hooks/useToast';
import useUpdateEffect from 'lib/hooks/useUpdateEffect';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TokenInfoFieldAddress from './fields/TokenInfoFieldAddress';
import TokenInfoFieldDocs from './fields/TokenInfoFieldDocs';
import TokenInfoFieldIconUrl from './fields/TokenInfoFieldIconUrl';
import TokenInfoFieldPriceTicker from './fields/TokenInfoFieldPriceTicker';
import TokenInfoFieldProjectDescription from './fields/TokenInfoFieldProjectDescription';
import TokenInfoFieldProjectEmail from './fields/TokenInfoFieldProjectEmail';
import TokenInfoFieldProjectName from './fields/TokenInfoFieldProjectName';
import TokenInfoFieldProjectSector from './fields/TokenInfoFieldProjectSector';
import TokenInfoFieldProjectWebsite from './fields/TokenInfoFieldProjectWebsite';
import TokenInfoFieldRequesterEmail from './fields/TokenInfoFieldRequesterEmail';
import TokenInfoFieldRequesterName from './fields/TokenInfoFieldRequesterName';
import TokenInfoFieldSocialLink from './fields/TokenInfoFieldSocialLink';
import TokenInfoFieldSupport from './fields/TokenInfoFieldSupport';
import TokenInfoFieldTokenName from './fields/TokenInfoFieldTokenName';
import TokenInfoFormSectionHeader from './TokenInfoFormSectionHeader';
import { getFormDefaultValues, prepareRequestBody } from './utils';

interface Props {
  address: string;
  tokenName: string;
  application?: TokenInfoApplication;
  onSubmit: (application: TokenInfoApplication) => void;
}

const TokenInfoForm = ({ address, tokenName, application, onSubmit }: Props) => {

  const containerRef = React.useRef<HTMLFormElement>(null);

  const apiFetch = useApiFetch();
  const toast = useToast();

  const configQuery = useApiQuery('token_info_applications_config', {
    pathParams: { chainId: appConfig.network.id },
  });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(address, tokenName, application),
  });
  const { handleSubmit, formState, control, trigger } = formApi;

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const submission = prepareRequestBody(data);
      const isNewApplication = !application?.id || [ 'REJECTED', 'APPROVED' ].includes(application.status);

      const result = await apiFetch<'token_info_applications', TokenInfoApplication, { message: string }>('token_info_applications', {
        pathParams: { chainId: appConfig.network.id, id: !isNewApplication ? application.id : undefined },
        fetchParams: {
          method: isNewApplication ? 'POST' : 'PUT',
          body: { submission },
        },
      });

      if ('id' in result) {
        onSubmit(result);
      } else {
        throw result;
      }
    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as ResourceError<{ message: string }>)?.payload?.message || 'Something went wrong. Try again later.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ apiFetch, application?.id, application?.status, onSubmit, toast ]);

  useUpdateEffect(() => {
    if (formState.submitCount > 0 && !formState.isValid) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ formState.isValid, formState.submitCount ]);

  if (configQuery.isError) {
    return <DataFetchAlert/>;
  }

  if (configQuery.isLoading) {
    return <ContentLoader/>;
  }

  const fieldProps = { control, isReadOnly: application?.status === 'IN_PROCESS' };

  return (
    <form noValidate onSubmit={ handleSubmit(onFormSubmit) } autoComplete="off" ref={ containerRef }>
      <div>Requests are sent to a moderator for review and approval. This process can take several days.</div>
      { application?.status === 'IN_PROCESS' &&
        <Alert status="warning" mt={ 6 }>Request in progress. Once an admin approves your request you can edit token info.</Alert> }
      <Grid mt={ 8 } gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 5 } rowGap={ 5 }>

        <TokenInfoFieldAddress { ...fieldProps }/>
        <TokenInfoFieldTokenName { ...fieldProps }/>
        <TokenInfoFieldRequesterName { ...fieldProps }/>
        <TokenInfoFieldRequesterEmail { ...fieldProps }/>

        <TokenInfoFormSectionHeader>Project info</TokenInfoFormSectionHeader>
        <TokenInfoFieldProjectName { ...fieldProps }/>
        <TokenInfoFieldProjectSector { ...fieldProps } config={ configQuery.data.projectSectors }/>
        <TokenInfoFieldProjectEmail { ...fieldProps }/>
        <TokenInfoFieldProjectWebsite { ...fieldProps }/>
        <TokenInfoFieldDocs { ...fieldProps }/>
        <TokenInfoFieldSupport { ...fieldProps }/>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TokenInfoFieldIconUrl { ...fieldProps } trigger={ trigger }/>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TokenInfoFieldProjectDescription { ...fieldProps }/>
        </GridItem>

        <TokenInfoFormSectionHeader>Links</TokenInfoFormSectionHeader>
        <TokenInfoFieldSocialLink { ...fieldProps } name="github"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="twitter"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="telegram"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="opensea"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="linkedin"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="facebook"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="discord"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="medium"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="slack"/>
        <TokenInfoFieldSocialLink { ...fieldProps } name="reddit"/>

        <TokenInfoFormSectionHeader>Price data</TokenInfoFormSectionHeader>
        <TokenInfoFieldPriceTicker { ...fieldProps } name="ticker_coin_market_cap" label="CoinMarketCap URL"/>
        <TokenInfoFieldPriceTicker { ...fieldProps } name="ticker_coin_gecko" label="CoinGecko URL"/>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TokenInfoFieldPriceTicker { ...fieldProps } name="ticker_defi_llama" label="DefiLlama URL "/>
        </GridItem>
      </Grid>
      <Button
        type="submit"
        size="lg"
        mt={ 8 }
        isLoading={ formState.isSubmitting }
        loadingText="Send request"
        isDisabled={ application?.status === 'IN_PROCESS' }
      >
        Send request
      </Button>
    </form>
  );
};

export default React.memo(TokenInfoForm);
