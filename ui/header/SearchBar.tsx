import { SearchIcon } from '@chakra-ui/icons';
import { InputGroup, Input, InputLeftAddon, InputLeftElement, useColorModeValue } from '@chakra-ui/react';
import type { ChangeEvent, FormEvent } from 'react';
import React from 'react';

import useBasePath from 'lib/hooks/useBasePath';

const SearchBar = () => {
  const [ value, setValue ] = React.useState('');
  const basePath = useBasePath();

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.assign(`https://blockscout.com${ basePath }/search-results?q=${ value }`);
  }, [ value, basePath ]);

  return (
    <form noValidate onSubmit={ handleSubmit }>
      <InputGroup>
        <InputLeftAddon w="111px">All filters</InputLeftAddon>
        <InputLeftElement w={ 6 } ml="132px" mr={ 2.5 }>
          <SearchIcon w={ 5 } h={ 5 } color={ useColorModeValue('blackAlpha.600', 'whiteAlpha.600') }/>
        </InputLeftElement>
        <Input
          paddingInlineStart="50px"
          placeholder="Search by addresses / transactions / block / token... "
          ml="1px"
          onChange={ handleChange }
          borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
        />
      </InputGroup>
    </form>
  );
};

export default SearchBar;
