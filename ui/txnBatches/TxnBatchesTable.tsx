import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TxnBatchesItem } from 'types/api/txnBatches';

import { default as Thead } from 'ui/shared/TheadSticky';

import TxnBatchesTableItem from './TxnBatchesTableItem';

type Props = {
  items: Array<TxnBatchesItem>;
  top: number;
}

const TxnBatchesTable = ({ items, top }: Props) => {
  return (
    <Table variant="simple" size="sm" minW="850px">
      <Thead top={ top }>
        <Tr>
          <Th width="170px">L2 block #</Th>
          <Th width="170px">L2 block txn count</Th>
          <Th width="160px">Epoch number</Th>
          <Th width="100%">L1 txn hash</Th>
          <Th width="150px">Age</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item) => (
          <TxnBatchesTableItem key={ item.l2_block_number } item={ item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default TxnBatchesTable;
