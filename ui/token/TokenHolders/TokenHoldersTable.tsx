import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { default as Thead } from 'ui/shared/TheadSticky';
import TokenHoldersTableItem from 'ui/token/TokenHolders/TokenHoldersTableItem';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
  top: number;
  isLoading?: boolean;
}

const TokenHoldersTable = ({ data, token, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th>Holder</Th>
          <Th isNumeric width="300px">Quantity</Th>
          { token.total_supply && <Th isNumeric width="175px">Percentage</Th> }
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <TokenHoldersTableItem key={ item.address.hash + (isLoading ? index : '') } holder={ item } token={ token } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TokenHoldersTable);
