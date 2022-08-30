import {
  Tr,
  Td,
  HStack,
  Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { ApiKey } from 'types/api/account';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: ApiKey;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
}

const ApiKeyTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.api_key }>
      <Td>
        <HStack>
          <Text fontSize="md" fontWeight={ 600 }>{ item.api_key }</Text>
          <CopyToClipboard text={ item.api_key }/>
        </HStack>
        <Text fontSize="sm" marginTop={ 0.5 } variant="secondary">{ item.name }</Text>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Td>
    </Tr>
  );
};

export default ApiKeyTableItem;
