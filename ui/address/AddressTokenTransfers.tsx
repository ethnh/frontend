import { Hide, Show, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import { AddressFromToFilterValues } from 'types/api/address';
import type { AddressFromToFilter, AddressTokenTransferResponse } from 'types/api/address';
import type { TokenType } from 'types/api/tokenInfo';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import { getResourceKey } from 'lib/api/useApiQuery';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import { TOKEN_TYPE, flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';
import TxsNewItemNotice from 'ui/txs/TxsNewItemNotice';

type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
}

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);
const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const OVERLOAD_COUNT = 75;

const matchFilters = (filters: Filters, tokenTransfer: TokenTransfer, address?: string) => {
  if (filters.filter) {
    if (filters.filter === 'from' && tokenTransfer.from.hash !== address) {
      return false;
    }
    if (filters.filter === 'to' && tokenTransfer.to.hash !== address) {
      return false;
    }
  }
  if (filters.type && filters.type.length) {
    if (!filters.type.includes(tokenTransfer.token.type)) {
      return false;
    }
  }

  return true;
};

const AddressTokenTransfers = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentAddress = router.query.id?.toString();

  const [ socketAlert, setSocketAlert ] = React.useState('');
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const [ filters, setFilters ] = React.useState<Filters>(
    { type: getTokenFilterValue(router.query.type) || [], filter: getAddressFilterValue(router.query.filter) },
  );

  const { isError, isLoading, data, pagination, onFilterChange, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_token_transfers',
    pathParams: { id: currentAddress },
    filters: filters,
    scrollRef,
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    onFilterChange({ ...filters, type: nextValue });
    setFilters((prevState) => ({ ...prevState, type: nextValue }));
  }, [ filters, onFilterChange ]);

  const handleAddressFilterChange = React.useCallback((nextValue: string) => {
    const filterVal = getAddressFilterValue(nextValue);
    onFilterChange({ ...filters, filter: filterVal });
    setFilters((prevState) => ({ ...prevState, filter: filterVal }));
  }, [ filters, onFilterChange ]);

  const handleNewSocketMessage: SocketMessage.AddressTokenTransfer['handler'] = (payload) => {
    setSocketAlert('');

    if (data?.items && data.items.length >= OVERLOAD_COUNT) {
      if (matchFilters(filters, payload.token_transfer, currentAddress)) {
        setNewItemsCount(prev => prev + 1);
      }
    } else {
      queryClient.setQueryData(
        getResourceKey('address_token_transfers', { pathParams: { id: router.query.id?.toString() }, queryParams: { ...filters } }),
        (prevData: AddressTokenTransferResponse | undefined) => {
          if (!prevData) {
            return;
          }

          if (!matchFilters(filters, payload.token_transfer, currentAddress)) {
            return prevData;
          }

          return {
            ...prevData,
            items: [
              payload.token_transfer,
              ...prevData.items,
            ],
          };
        });
    }
  };

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please click here to load new token transfers.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new token transfers. Please click here to refresh the page.');
  }, []);

  const channel = useSocketChannel({
    topic: `addresses:${ (router.query.id as string).toLowerCase() }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: pagination.page !== 1,
  });

  useSocketMessage({
    channel,
    event: 'token_transfer',
    handler: handleNewSocketMessage,
  });

  const numActiveFilters = (filters.type?.length || 0) + (filters.filter ? 1 : 0);
  const isActionBarHidden = !numActiveFilters && !data?.items.length;

  const content = (() => {
    if (isLoading) {
      return (
        <>
          <Hide below="lg">
            <SkeletonTable columns={ [ '44px', '185px', '160px', '25%', '25%', '25%', '25%' ] }/>
          </Hide>
          <Show below="lg">
            <SkeletonList/>
          </Show>
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!data.items?.length && !numActiveFilters) {
      return <Text as="span">There are no token transfers</Text>;
    }

    if (!data.items?.length) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any token transfer that matches your query.` }/>;
    }

    const items = data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg">
          <TokenTransferTable
            data={ items }
            baseAddress={ currentAddress }
            showTxInfo
            top={ 80 }
            enableTimeIncrement
            showSocketInfo
            socketInfoAlert={ socketAlert }
            socketInfoNum={ newItemsCount }
          />
        </Hide>
        <Show below="lg">
          <TxsNewItemNotice url={ window.location.href } num={ newItemsCount } alert={ socketAlert }/>
          <TokenTransferList
            data={ items }
            baseAddress={ currentAddress }
            showTxInfo
            enableTimeIncrement
          />
        </Show>
      </>
    );
  })();

  return (
    <>
      { !isActionBarHidden && (
        <ActionBar mt={ -6 }>
          <TokenTransferFilter
            defaultTypeFilters={ filters.type }
            onTypeFilterChange={ handleTypeFilterChange }
            appliedFiltersNum={ numActiveFilters }
            withAddressFilter
            onAddressFilterChange={ handleAddressFilterChange }
            defaultAddressFilter={ filters.filter }
          />
          { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
        </ActionBar>
      ) }
      { content }
    </>
  );
};

export default AddressTokenTransfers;
