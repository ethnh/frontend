import React, { useCallback, useEffect } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Checkbox,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import AddressInput from '../../shared/AddressInput';
import TagInput from '../../shared/TagInput';

import type { TWatchlistItem } from '../../../data/watchlist';

const NOTIFICATIONS = [ 'xDAI', 'ERC-20', 'ERC-721, ERC-1155 (NFT)' ];
const ADDRESS_LENGTH = 42;
const TAG_MAX_LENGTH = 35;

type Props = {
  data?: TWatchlistItem;
}

type Inputs = {
  address: string;
  tag: string;
  notification: boolean;
}

const AddressModal: React.FC<Props> = ({ data }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue('address', data?.address || '');
    setValue('tag', data?.tag || '');
    setValue('notification', Boolean(data?.notification));
  }, [ setValue, data ]);

  // eslint-disable-next-line no-console
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  const renderAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'address'>}) => {
    return <AddressInput field={ field } isInvalid={ Boolean(errors.address) }/>
  }, [ errors ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput field={ field } isInvalid={ Boolean(errors.tag) }/>
  }, [ errors ]);

  const renderCheckbox = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'notification'>}) => (
    <Checkbox
      isChecked={ field.value }
      onChange={ field.onChange }
      ref={ field.ref }
      colorScheme="blue"
      size="lg"
    >
        Email notifications
    </Checkbox>
  ), []);

  return (
    <>
      <Box marginBottom={ 5 }>
        <Controller
          name="address"
          control={ control }
          rules={{
            maxLength: ADDRESS_LENGTH,
            minLength: ADDRESS_LENGTH,
          }}
          render={ renderAddressInput }
        />
      </Box>
      <Box marginBottom={ 8 }>
        <Controller
          name="tag"
          control={ control }
          rules={{
            maxLength: TAG_MAX_LENGTH,
          }}
          render={ renderTagInput }
        />
      </Box>
      <Text color="gray.500" fontSize="sm" marginBottom={ 5 }>
        Please select what types of notifications you will receive
      </Text>
      <Box marginBottom={ 8 }>
        { /* add them to the form later */ }
        <Grid templateColumns="repeat(3, max-content)" gap="20px 24px">
          { NOTIFICATIONS.map((notification: string) => {
            return (
              <React.Fragment key={ notification }>
                <GridItem>{ notification }</GridItem>
                <GridItem><Checkbox colorScheme="blue" size="lg">Incoming</Checkbox></GridItem>
                <GridItem><Checkbox colorScheme="blue" size="lg">Outgoing</Checkbox></GridItem>
              </React.Fragment>
            )
          }) }
        </Grid>
      </Box>
      <Text color="gray.500" fontSize="sm" marginBottom={ 5 }>Notification methods</Text>
      <Controller
        name="notification"
        control={ control }
        render={ renderCheckbox }
      />
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          variant="primary"
          onClick={ handleSubmit(onSubmit) }
          disabled={ Object.keys(errors).length > 0 }
        >
          { data ? 'Save changes' : 'Add address' }
        </Button>
      </Box>
    </>
  )
}

export default AddressModal;
