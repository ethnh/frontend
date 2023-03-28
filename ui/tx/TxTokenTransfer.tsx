import { Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';

import { SECOND } from 'lib/consts';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import TOKEN_TYPE from 'lib/token/tokenTypes';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/Pagination';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);

const TxTokenTransfer = () => {
  const txsInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });

  const router = useRouter();

  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || []);

  const tokenTransferQuery = useQueryWithPages({
    resourceName: 'tx_token_transfers',
    pathParams: { hash: txsInfo.data?.hash.toString() },
    options: { enabled: Boolean(txsInfo.data?.status && txsInfo.data?.hash) },
    filters: { type: typeFilter },
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    tokenTransferQuery.onFilterChange({ type: nextValue });
    setTypeFilter(nextValue);
  }, [ tokenTransferQuery ]);

  if (!txsInfo.isLoading && !txsInfo.isError && !txsInfo.data.status) {
    return txsInfo.socketStatus ? <TxSocketAlert status={ txsInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txsInfo.isError || tokenTransferQuery.isError) {
    return <DataFetchAlert/>;
  }

  const numActiveFilters = typeFilter.length;
  const isActionBarHidden = !numActiveFilters && !tokenTransferQuery.data?.items.length;

  const items = tokenTransferQuery.data?.items?.reduce(flattenTotal, []);

  const content = items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <TokenTransferTable data={ items } top={ isActionBarHidden ? 0 : 80 }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TokenTransferList data={ items }/>
      </Show>
    </>
  ) : null;

  const actionBar = !isActionBarHidden ? (
    <ActionBar mt={ -6 }>
      <TokenTransferFilter
        defaultTypeFilters={ typeFilter }
        onTypeFilterChange={ handleTypeFilterChange }
        appliedFiltersNum={ numActiveFilters }
      />
      { tokenTransferQuery.isPaginationVisible && <Pagination ml="auto" { ...tokenTransferQuery.pagination }/> }
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ txsInfo.isError || tokenTransferQuery.isError }
      isLoading={ txsInfo.isLoading || tokenTransferQuery.isLoading }
      items={ tokenTransferQuery.data?.items }
      skeletonProps={{
        isLongSkeleton: true,
        skeletonDesktopColumns: [ '185px', '25%', '25%', '25%', '25%' ],
      }}
      emptyText="There are no token transfers."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any token transfer that matches your query.`,
        hasActiveFilters: Boolean(numActiveFilters),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxTokenTransfer;
