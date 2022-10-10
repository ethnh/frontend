import { Flex, Link, Spinner, Text, Box, Icon, useColorModeValue } from '@chakra-ui/react';
import { utils } from 'ethers';
import React from 'react';

import type { Block } from 'types/api/block';

import flameIcon from 'icons/flame.svg';
import getBlockReward from 'lib/block/getBlockReward';
import dayjs from 'lib/date/dayjs';
import useNetwork from 'lib/hooks/useNetwork';
import useLink from 'lib/link/useLink';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AddressLink from 'ui/shared/address/AddressLink';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: Block;
  isPending?: boolean;
}

const BlocksListItem = ({ data, isPending }: Props) => {
  const spinnerEmptyColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const link = useLink();
  const network = useNetwork();
  const { totalReward, burntFees, txFees } = getBlockReward(data);

  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">
          { isPending && <Spinner size="sm" color="blue.500" emptyColor={ spinnerEmptyColor }/> }
          <Link
            fontWeight={ 600 }
            href={ link('block_index', { id: String(data.height) }) }
          >
            { data.height }
          </Link>
        </Flex>
        <Text variant="secondary"fontWeight={ 400 }>{ dayjs(data.timestamp).fromNow() }</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Size</Text>
        <Text variant="secondary">{ data.size.toLocaleString('en') } bytes</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Miner</Text>
        <AddressLink alias={ data.miner.name } hash={ data.miner.hash } truncation="constant"/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Txn</Text>
        <Text variant="secondary">{ data.tx_count }</Text>
      </Flex>
      <Box>
        <Text fontWeight={ 500 }>Gas used</Text>
        <Flex columnGap={ 4 }>
          <Text variant="secondary">{ utils.commify(data.gas_used) }</Text>
          <Utilization colorScheme="gray" value={ utils.parseUnits(data.gas_used).mul(10_000).div(utils.parseUnits(data.gas_limit)).toNumber() / 10_000 }/>
          <GasUsedToTargetRatio value={ data.gas_target_percentage || undefined }/>
        </Flex>
      </Box>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Reward { network?.currency }</Text>
        <Text variant="secondary">{ utils.formatUnits(totalReward) }</Text>
      </Flex>
      <Flex>
        <Text fontWeight={ 500 }>Burnt fees</Text>
        <Icon as={ flameIcon } boxSize={ 5 } color="gray.500" ml={ 2 }/>
        <Text variant="secondary" ml={ 1 }>{ utils.formatUnits(burntFees) }</Text>
        <Utilization ml={ 4 } value={ burntFees.mul(10_000).div(txFees).toNumber() / 10_000 }/>
      </Flex>
    </AccountListItemMobile>
  );
};

export default BlocksListItem;
