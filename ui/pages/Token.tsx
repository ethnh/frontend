import { Skeleton, Box, Flex, SkeletonCircle, Icon, Tag } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInfo } from 'types/api/token';
import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import appConfig from 'configs/app/config';
import iconSuccess from 'icons/status/success.svg';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import AddressContract from 'ui/address/AddressContract';
import TextAd from 'ui/shared/ad/TextAd';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';
import TokenLogo from 'ui/shared/TokenLogo';
import TokenContractInfo from 'ui/token/TokenContractInfo';
import TokenDetails from 'ui/token/TokenDetails';
import TokenHolders from 'ui/token/TokenHolders/TokenHolders';
import TokenInventory from 'ui/token/TokenInventory';
import TokenTransfer from 'ui/token/TokenTransfer/TokenTransfer';

export type TokenTabs = 'token_transfers' | 'holders' | 'inventory';

const TokenPageContent = () => {
  const [ isSocketOpen, setIsSocketOpen ] = React.useState(false);
  const [ totalSupplySocket, setTotalSupplySocket ] = React.useState<number>();
  const router = useRouter();
  const isMobile = useIsMobile();

  const appProps = useAppContext();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const hashString = router.query.hash?.toString();

  const queryClient = useQueryClient();

  const tokenQuery = useApiQuery('token', {
    pathParams: { hash: hashString },
    queryOptions: { enabled: isSocketOpen && Boolean(router.query.hash) },
  });

  React.useEffect(() => {
    if (tokenQuery.data && totalSupplySocket) {
      queryClient.setQueryData(getResourceKey('token', { pathParams: { hash: hashString } }), (prevData: TokenInfo | undefined) => {
        if (prevData) {
          return { ...prevData, total_supply: totalSupplySocket.toString() };
        }
      });
    }
  }, [ tokenQuery.data, totalSupplySocket, hashString, queryClient ]);

  const handleTotalSupplyMessage: SocketMessage.TokenTotalSupply['handler'] = React.useCallback((payload) => {
    const prevData = queryClient.getQueryData(getResourceKey('token', { pathParams: { hash: hashString } }));
    if (!prevData) {
      setTotalSupplySocket(payload.total_supply);
    }
    queryClient.setQueryData(getResourceKey('token', { pathParams: { hash: hashString } }), (prevData: TokenInfo | undefined) => {
      if (prevData) {
        return { ...prevData, total_supply: payload.total_supply.toString() };
      }
    });
  }, [ queryClient, hashString ]);

  const channel = useSocketChannel({
    topic: `tokens:${ hashString?.toLowerCase() }`,
    isDisabled: !hashString,
    onJoin: () => setIsSocketOpen(true),
  });
  useSocketMessage({
    channel,
    event: 'total_supply',
    handler: handleTotalSupplyMessage,
  });

  useEffect(() => {
    if (tokenQuery.data) {
      const tokenSymbol = tokenQuery.data.symbol ? ` (${ tokenQuery.data.symbol })` : '';
      const tokenName = `${ tokenQuery.data.name || 'Unnamed' }${ tokenSymbol }`;
      const title = document.getElementsByTagName('title')[0];
      if (title) {
        title.textContent = title.textContent?.replace(tokenQuery.data.address, tokenName) || title.textContent;
      }
      const description = document.getElementsByName('description')[0] as HTMLMetaElement;
      if (description) {
        description.content = description.content.replace(tokenQuery.data.address, tokenName) || description.content;
      }
    }
  }, [ tokenQuery.data ]);

  const transfersQuery = useQueryWithPages({
    resourceName: 'token_transfers',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(router.query.hash && (!router.query.tab || router.query.tab === 'token_transfers') && tokenQuery.data),
    },
  });

  const holdersQuery = useQueryWithPages({
    resourceName: 'token_holders',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(router.query.hash && router.query.tab === 'holders' && tokenQuery.data),
    },
  });

  const inventoryQuery = useQueryWithPages({
    resourceName: 'token_inventory',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(router.query.hash && router.query.tab === 'inventory' && tokenQuery.data),
    },
  });

  const contractQuery = useApiQuery('address', {
    pathParams: { hash: hashString },
    queryOptions: { enabled: Boolean(router.query.hash) },
  });

  const isVerifiedInfoEnabled = Boolean(appConfig.contractInfoApi.endpoint);
  const verifiedInfoQuery = useApiQuery('token_verified_info', {
    pathParams: { hash: hashString, chainId: appConfig.network.id },
    queryOptions: { enabled: Boolean(tokenQuery.data) && isVerifiedInfoEnabled },
  });

  const contractTabs = useContractTabs(contractQuery.data);

  const tabs: Array<RoutedTab> = [
    { id: 'token_transfers', title: 'Token transfers', component: <TokenTransfer transfersQuery={ transfersQuery }/> },
    { id: 'holders', title: 'Holders', component: <TokenHolders tokenQuery={ tokenQuery } holdersQuery={ holdersQuery }/> },
    (tokenQuery.data?.type === 'ERC-1155' || tokenQuery.data?.type === 'ERC-721') ?
      { id: 'inventory', title: 'Inventory', component: <TokenInventory inventoryQuery={ inventoryQuery }/> } :
      undefined,
    contractQuery.data?.is_contract ? {
      id: 'contract',
      title: () => {
        if (contractQuery.data.is_verified) {
          return (
            <>
              <span>Contract</span>
              <Icon as={ iconSuccess } boxSize="14px" color="green.500" ml={ 1 }/>
            </>
          );
        }

        return 'Contract';
      },
      component: <AddressContract tabs={ contractTabs } addressHash={ hashString }/>,
      subTabs: contractTabs.map(tab => tab.id),
    } : undefined,
  ].filter(Boolean);

  let hasPagination;
  let pagination;

  if (!router.query.tab || router.query.tab === 'token_transfers') {
    hasPagination = transfersQuery.isPaginationVisible;
    pagination = transfersQuery.pagination;
  }

  if (router.query.tab === 'holders') {
    hasPagination = holdersQuery.isPaginationVisible;
    pagination = holdersQuery.pagination;
  }

  if (router.query.tab === 'inventory') {
    hasPagination = inventoryQuery.isPaginationVisible;
    pagination = inventoryQuery.pagination;
  }

  const tokenSymbolText = tokenQuery.data?.symbol ? ` (${ trimTokenSymbol(tokenQuery.data.symbol) })` : '';

  const tabListProps = React.useCallback(({ isSticky, activeTabIndex }: { isSticky: boolean; activeTabIndex: number }) => {
    if (isMobile) {
      return { mt: 8 };
    }

    return {
      mt: 3,
      py: 5,
      marginBottom: 0,
      boxShadow: activeTabIndex === 2 && isSticky ? 'action_bar' : 'none',
    };
  }, [ isMobile ]);

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/tokens');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to tokens list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const tags = [
    { label: tokenQuery.data?.type, display_name: tokenQuery.data?.type },
    ...(contractQuery.data?.private_tags || []),
    ...(contractQuery.data?.public_tags || []),
    ...(contractQuery.data?.watchlist_names || []),
  ]
    .filter(Boolean)
    .map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);
  const tagsNode = tags.length > 0 ? <Flex columnGap={ 2 }>{ tags }</Flex> : null;

  return (
    <Page>
      { tokenQuery.isLoading ? (
        <>
          <Skeleton h={{ base: 12, lg: 6 }} mb={ 6 } w="100%" maxW="680px"/>
          <Flex alignItems="center" mb={ 6 }>
            <SkeletonCircle w={ 6 } h={ 6 } mr={ 3 }/>
            <Skeleton w="500px" h={ 10 }/>
          </Flex>
        </>
      ) : (
        <>
          <TextAd mb={ 6 }/>
          <PageTitle
            text={ `${ tokenQuery.data?.name || 'Unnamed' }${ tokenSymbolText } token` }
            backLink={ backLink }
            additionalsLeft={ (
              <TokenLogo hash={ tokenQuery.data?.address } name={ tokenQuery.data?.name } boxSize={ 6 }/>
            ) }
            additionalsRight={ tagsNode }
            afterTitle={ verifiedInfoQuery.data ? <Icon as={ iconSuccess } color="green.500" boxSize={ 4 } verticalAlign="top"/> : null }
          />
        </>
      ) }
      <TokenContractInfo tokenQuery={ tokenQuery }/>
      <TokenDetails tokenQuery={ tokenQuery } verifiedInfoQuery={ verifiedInfoQuery } isVerifiedInfoEnabled={ isVerifiedInfoEnabled }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      { tokenQuery.isLoading || contractQuery.isLoading ? <SkeletonTabs/> : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ tabListProps }
          rightSlot={ !isMobile && hasPagination ? <Pagination { ...(pagination as PaginationProps) }/> : null }
          stickyEnabled={ !isMobile }
        />
      ) }

      { !tokenQuery.isLoading && !tokenQuery.isError && <Box h={{ base: 0, lg: '40vh' }}/> }
    </Page>
  );
};

export default TokenPageContent;
