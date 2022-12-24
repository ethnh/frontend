import { Tag, Box, Switch, Text, HStack, Flex } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import useFetch from 'lib/hooks/useFetch';
import useToast from 'lib/hooks/useToast';
import ListItemMobile from 'ui/shared/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: TWatchlistItem;
  onEditClick: (data: TWatchlistItem) => void;
  onDeleteClick: (data: TWatchlistItem) => void;
}

const WatchListItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const [ notificationEnabled, setNotificationEnabled ] = useState(item.notification_methods.email);
  const [ switchDisabled, setSwitchDisabled ] = useState(false);
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const errorToast = useToast();
  const fetch = useFetch();

  const showErrorToast = useCallback(() => {
    errorToast({
      position: 'top-right',
      description: 'There has been an error processing your request',
      colorScheme: 'red',
      status: 'error',
      variant: 'subtle',
      isClosable: true,
      icon: null,
    });
  }, [ errorToast ]);

  const notificationToast = useToast();
  const showNotificationToast = useCallback((isOn: boolean) => {
    notificationToast({
      position: 'top-right',
      description: isOn ? 'Email notification is ON' : 'Email notification is OFF',
      colorScheme: 'green',
      status: 'success',
      variant: 'subtle',
      title: 'Success',
      isClosable: true,
      icon: null,
    });
  }, [ notificationToast ]);

  const { mutate } = useMutation(() => {
    setSwitchDisabled(true);
    const body = { ...item, notification_methods: { email: !notificationEnabled } };
    setNotificationEnabled(prevState => !prevState);
    return fetch(`/node-api/account/watchlist/${ item.id }`, { method: 'PUT', body });
  }, {
    onError: () => {
      showErrorToast();
      setNotificationEnabled(prevState => !prevState);
      setSwitchDisabled(false);
    },
    onSuccess: () => {
      setSwitchDisabled(false);
      showNotificationToast(!notificationEnabled);
    },
  });

  const onSwitch = useCallback(() => {
    return mutate();
  }, [ mutate ]);

  return (
    <ListItemMobile>
      <Box maxW="100%">
        <WatchListAddressItem item={ item }/>
        <HStack spacing={ 3 } mt={ 6 }>
          <Text fontSize="sm" fontWeight={ 500 }>Private tag</Text>
          <Tag>
            { item.name }
          </Tag>
        </HStack>
      </Box>
      <Flex alignItems="center" justifyContent="space-between" mt={ 6 } w="100%">
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Email notification</Text>
          <Switch
            colorScheme="blue"
            size="md"
            isChecked={ notificationEnabled }
            onChange={ onSwitch }
            aria-label="Email notification"
            isDisabled={ switchDisabled }
          />
        </HStack>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Flex>
    </ListItemMobile>
  );
};

export default WatchListItem;
