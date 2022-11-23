import { Box, Button, Stack, Link, Text, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { ApiKey, ApiKeys } from 'types/api/account';
import { QueryKeys } from 'types/client/accountQueries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import { space } from 'lib/html-entities';
import ApiKeyModal from 'ui/apiKey/ApiKeyModal/ApiKeyModal';
import ApiKeyListItem from 'ui/apiKey/ApiKeyTable/ApiKeyListItem';
import ApiKeyTable from 'ui/apiKey/ApiKeyTable/ApiKeyTable';
import DeleteApiKeyModal from 'ui/apiKey/DeleteApiKeyModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonAccountMobile from 'ui/shared/SkeletonAccountMobile';
import SkeletonTable from 'ui/shared/SkeletonTable';

const DATA_LIMIT = 3;

const ApiKeysPage: React.FC = () => {
  const apiKeyModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const isMobile = useIsMobile();
  const fetch = useFetch();
  useRedirectForInvalidAuthToken();

  const [ apiKeyModalData, setApiKeyModalData ] = useState<ApiKey>();
  const [ deleteModalData, setDeleteModalData ] = useState<ApiKey>();

  const { data, isLoading, isError } = useQuery<unknown, unknown, ApiKeys>([ QueryKeys.apiKeys ], async() => await fetch('/node-api/account/api-keys'));

  const onEditClick = useCallback((data: ApiKey) => {
    setApiKeyModalData(data);
    apiKeyModalProps.onOpen();
  }, [ apiKeyModalProps ]);

  const onApiKeyModalClose = useCallback(() => {
    setApiKeyModalData(undefined);
    apiKeyModalProps.onClose();
  }, [ apiKeyModalProps ]);

  const onDeleteClick = useCallback((data: ApiKey) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      Create API keys to use for your RPC and EthRPC API requests. For more information, see { space }
      <Link href="https://docs.blockscout.com/for-users/api#api-keys" target="_blank">“How to use a Blockscout API key”</Link>.
    </AccountPageDescription>
  );

  const content = (() => {
    if (isLoading && !data) {
      const loader = isMobile ? <SkeletonAccountMobile/> : (
        <>
          <SkeletonTable columns={ [ '100%', '108px' ] }/>
          <Skeleton height="48px" width="156px" marginTop={ 8 }/>
        </>
      );

      return (
        <>
          { description }
          { loader }
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    const list = isMobile ? (
      <Box>
        { data.map((item) => (
          <ApiKeyListItem
            item={ item }
            key={ item.api_key }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Box>
    ) : (
      <ApiKeyTable
        data={ data }
        onDeleteClick={ onDeleteClick }
        onEditClick={ onEditClick }
        limit={ DATA_LIMIT }
      />
    );

    const canAdd = data.length < DATA_LIMIT;
    return (
      <>
        { description }
        { Boolean(data.length) && list }
        <Stack marginTop={ 8 } spacing={ 5 } direction={{ base: 'column', lg: 'row' }}>
          <Button
            size="lg"
            onClick={ apiKeyModalProps.onOpen }
            disabled={ !canAdd }
          >
            Add API key
          </Button>
          { !canAdd && (
            <Text fontSize="sm" variant="secondary">
              { `You have added the maximum number of API keys (${ DATA_LIMIT }). Contact us to request additional keys.` }
            </Text>
          ) }
        </Stack>
        <ApiKeyModal { ...apiKeyModalProps } onClose={ onApiKeyModalClose } data={ apiKeyModalData }/>
        { deleteModalData && <DeleteApiKeyModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/> }
      </>
    );
  })();

  return (
    <Page>
      <Box h="100%">
        <PageTitle text="API keys"/>
        { content }
      </Box>
    </Page>
  );
};

export default ApiKeysPage;
