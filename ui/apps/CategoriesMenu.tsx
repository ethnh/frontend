import { Box, Button, Icon, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceCategoriesIds, MarketplaceCategory } from 'types/client/apps';

import eastMiniArrowIcon from 'icons/arrows/east-mini.svg';

import CategoriesMenuItem from './CategoriesMenuItem';
import { APP_CATEGORIES } from './constants';

const categoriesList = Object.keys(APP_CATEGORIES).map((id: string) => ({
  id: id,
  name: APP_CATEGORIES[id as MarketplaceCategoriesIds],
})) as Array<MarketplaceCategory>;

type Props = {
  selectedCategoryId: MarketplaceCategoriesIds;
  onSelect: (category: MarketplaceCategoriesIds) => void;
}

const CategoriesMenu = ({ selectedCategoryId, onSelect }: Props) => {
  const selectedCategory = categoriesList.find(category => category.id === selectedCategoryId);

  return (
    <Menu>
      <MenuButton
        as={ Button }
        mb={{ base: 2, sm: 0 }}
        mr={{ base: 0, sm: 2 }}
        size="md"
        variant="outline"
        colorScheme="gray"
        flexShrink={ 0 }
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
        >
          { selectedCategory ? selectedCategory.name : 'All' }
          <Icon transform="rotate(-90deg)" ml={{ base: 'auto', sm: 1 }} as={ eastMiniArrowIcon } w={ 5 } h={ 5 }/>
        </Box>
      </MenuButton>

      <MenuList zIndex={ 3 }>
        { categoriesList.map((category: MarketplaceCategory) => (
          <CategoriesMenuItem
            key={ category.id }
            id={ category.id }
            name={ category.name }
            onClick={ onSelect }
          />
        )) }
      </MenuList>
    </Menu>
  );
};

export default React.memo(CategoriesMenu);
