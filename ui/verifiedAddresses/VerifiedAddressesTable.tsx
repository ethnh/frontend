import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedAddress } from 'types/api/account';

import VerifiedAddressesTableItem from './VerifiedAddressesTableItem';

interface Props {
  data: Array<VerifiedAddress>;
  onItemAdd: (address: string) => void;
  onItemEdit: (item: VerifiedAddress) => void;
}

const VerifiedAddressesTable = ({ data, onItemEdit, onItemAdd }: Props) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Address</Th>
          <Th w="180px">Token info</Th>
          <Th w="260px">Request status</Th>
          <Th w="160px">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item) => (
          <VerifiedAddressesTableItem
            key={ item.contractAddress }
            item={ item }
            onAdd={ onItemAdd }
            onEdit={ onItemEdit }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(VerifiedAddressesTable);
