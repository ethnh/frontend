import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';

import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';

import Page from '../components/Page/Page';

import WatchlistTable from '../components/WatchlistTable/WatchlistTable';
import AddressModal from '../components/AddressModal/AddressModal';

import type { TWatchlistItem } from '../data/watchlist';
import { watchlist } from '../data/watchlist';
import DeleteModal from '../components/DeleteModal/DeleteModal';

const WatchList: NextPage = () => {
  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ addressModalData, setAddressModalData ] = useState<TWatchlistItem>();
  const [ deleteModalData, setDeleteModalData ] = useState<string>();

  const onEditClick = useCallback((data: TWatchlistItem) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ])

  const onAddressModalClose = useCallback(() => {
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  const onDeleteClick = useCallback((data: TWatchlistItem) => {
    setDeleteModalData(data.address);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ])

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  return (
    <Page>
      <Box h="100%">
        <Text marginBottom="40px">An Email notification can be sent to you when an address on your watch list sends or receives any transactions.</Text>
        { Boolean(watchlist.length) && (
          <WatchlistTable
            data={ watchlist }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        ) }
        <Box marginTop="32px">
          <Button
            colorScheme="blue"
            onClick={ addressModalProps.onOpen }
          >
            Add address
          </Button>
        </Box>
      </Box>
      <AddressModal { ...addressModalProps } onClose={ onAddressModalClose } data={ addressModalData }/>
      <DeleteModal { ...deleteModalProps } onClose={ onDeleteModalClose } address={ deleteModalData }/>
    </Page>
  );
};

export default WatchList
