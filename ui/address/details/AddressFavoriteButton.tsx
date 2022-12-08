import { Icon, chakra, Tooltip, IconButton, useDisclosure } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { UserInfo } from 'types/api/account';
import type { TWatchlist } from 'types/client/account';
import { QueryKeys as AccountQueryKeys } from 'types/client/accountQueries';
import { QueryKeys } from 'types/client/queries';

import starFilledIcon from 'icons/star_filled.svg';
import starOutlineIcon from 'icons/star_outline.svg';
import useFetch from 'lib/hooks/useFetch';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import link from 'lib/link/link';
import WatchlistAddModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';

interface Props {
  className?: string;
  hash: string;
  isAdded: boolean;
}

const AddressFavoriteButton = ({ className, hash, isAdded }: Props) => {
  const addModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const queryClient = useQueryClient();
  const router = useRouter();
  const fetch = useFetch();

  const profileData = queryClient.getQueryData<UserInfo>([ AccountQueryKeys.profile ]);
  const isAuth = Boolean(profileData);

  const watchListQuery = useQuery<unknown, unknown, TWatchlist>(
    [ AccountQueryKeys.watchlist ],
    async() => fetch('/node-api/account/watchlist'),
    {
      enabled: isAdded,
    },
  );

  const handleClick = React.useCallback(() => {
    if (!isAuth) {
      const loginUrl = link('auth');
      window.location.assign(loginUrl);
      return;
    }
    isAdded ? deleteModalProps.onOpen() : addModalProps.onOpen();
  }, [ addModalProps, deleteModalProps, isAdded, isAuth ]);

  const handleAddOrDeleteSuccess = React.useCallback(async() => {
    await queryClient.refetchQueries({ queryKey: [ QueryKeys.address, router.query.id ] });
    addModalProps.onClose();
  }, [ addModalProps, queryClient, router.query.id ]);

  const handleAddModalClose = React.useCallback(() => {
    addModalProps.onClose();
  }, [ addModalProps ]);

  const handleDeleteModalClose = React.useCallback(() => {
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const formData = React.useMemo(() => {
    return {
      address_hash: hash,
      // FIXME temporary solution
      // there is no endpoint in api what can return watchlist address info by its hash
      // so we look up in the whole watchlist and hope we can find a necessary item
      id: watchListQuery.data?.find((address) => address.address?.hash === hash)?.id || '',
    };
  }, [ hash, watchListQuery.data ]);

  return (
    <>
      <Tooltip label={ `${ isAdded ? 'Remove address from Watch list' : 'Add address to Watch list' }` }>
        <IconButton
          isActive={ isAdded }
          className={ className }
          aria-label="edit"
          variant="outline"
          size="sm"
          pl={ 2 }
          pr={ 2 }
          onClick={ handleClick }
          icon={ <Icon as={ isAdded ? starFilledIcon : starOutlineIcon } boxSize={ 5 }/> }
          onFocusCapture={ usePreventFocusAfterModalClosing() }
        />
      </Tooltip>
      <WatchlistAddModal
        { ...addModalProps }
        isAdd
        onClose={ handleAddModalClose }
        onSuccess={ handleAddOrDeleteSuccess }
        data={ formData }
      />
      <DeleteAddressModal
        { ...deleteModalProps }
        onClose={ handleDeleteModalClose }
        data={ formData }
        onSuccess={ handleAddOrDeleteSuccess }
      />
    </>
  );
};

export default chakra(AddressFavoriteButton);
