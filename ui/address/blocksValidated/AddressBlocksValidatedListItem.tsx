import { Link, Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import link from 'lib/link/link';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = Block & {
  page: number;
};

const AddressBlocksValidatedListItem = (props: Props) => {
  const blockUrl = link('block', { id: String(props.height) });
  const timeAgo = useTimeAgoIncrement(props.timestamp, props.page === 1);
  const totalReward = getBlockTotalReward(props);

  return (
    <AccountListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <Link href={ blockUrl } fontWeight="700">{ props.height }</Link>
        <Text variant="secondary">{ timeAgo }</Text>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Txn</Text>
        <Text variant="secondary">{ props.tx_count }</Text>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Gas used</Text>
        <Text variant="secondary">{ BigNumber(props.gas_used || 0).toFormat() }</Text>
        <Utilization colorScheme="gray" value={ BigNumber(props.gas_used || 0).dividedBy(BigNumber(props.gas_limit)).toNumber() }/>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Reward { appConfig.network.currency.symbol }</Text>
        <Text variant="secondary">{ totalReward.toFixed() }</Text>
      </Flex>
    </AccountListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
