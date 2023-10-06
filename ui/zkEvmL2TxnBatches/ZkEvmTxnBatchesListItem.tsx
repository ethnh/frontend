import { Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvml2TxnBatches';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import ZkEvmBatchEntityL2 from 'ui/shared/entities/block/ZkEvmBatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ZkEvmL2TxnBatchStatus from 'ui/shared/statusTag/ZkEvmL2TxnBatchStatus';

const feature = config.features.rollup;

type Props = { item: ZkEvmL2TxnBatchesItem; isLoading?: boolean };

const ZkEvmTxnBatchesListItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.timestamp).fromNow();

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ZkEvmBatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ZkEvmL2TxnBatchStatus status={ status } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ timeAgo }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn count</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          href={ route({ pathname: '/zkevm-l2-txn-batch/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
          fontWeight={ 600 }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px">
            { item.tx_count }
          </Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Verify Tx Has</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.verify_tx_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.verify_tx_hash }
            fontSize="sm"
            lineHeight={ 5 }
            maxW="100%"
          />
        ) : <Text>Pending</Text> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Sequence hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.sequence_tx_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.sequence_tx_hash }
            fontSize="sm"
            lineHeight={ 5 }
            maxW="100%"
          />
        ) : <Text>Pending</Text> }
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ZkEvmTxnBatchesListItem;
