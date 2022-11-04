import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import { default as Thead } from 'ui/shared/TheadSticky';
import TokenTransferTableItem from 'ui/shared/TokenTransfer/TokenTransferTableItem';

interface Props {
  data: Array<TokenTransfer>;
  baseAddress?: string;
}

const TxInternalsTable = ({ data, baseAddress }: Props) => {

  return (
    <Table variant="simple" size="sm" mt={ 6 }>
      <Thead top={ 0 }>
        <Tr>
          <Th width="44px"></Th>
          <Th width="185px">Token</Th>
          <Th width="160px">Token ID</Th>
          <Th width="25%">Txn hash</Th>
          <Th width="25%">From</Th>
          { baseAddress && <Th width="50px" px={ 0 }/> }
          <Th width="25%">To</Th>
          <Th width="25%">Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <TokenTransferTableItem key={ index } { ...item } baseAddress={ baseAddress }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TxInternalsTable);
