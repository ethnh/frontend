import { GridItem, Flex, Text } from '@chakra-ui/react';
import type { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';

import Hint from 'ui/shared/Hint';

interface Props extends Omit<HTMLChakraProps<'div'>, 'title'> {
  title: React.ReactNode;
  hint: string;
  children: React.ReactNode;
  note?: string;
}

const DetailsInfoItem = ({ title, hint, note, children, id, ...styles }: Props) => {
  return (
    <>
      <GridItem py={{ base: 1, lg: 2 }} id={ id } lineHeight={ 5 } { ...styles } whiteSpace="nowrap" _notFirst={{ mt: { base: 3, lg: 0 } }}>
        <Flex columnGap={ 2 } alignItems="flex-start">
          <Hint label={ hint }/>
          <Text fontWeight={{ base: 700, lg: 500 }}>
            { title }
            { note && <Text fontWeight={ 500 } variant="secondary" fontSize="xs" className="note" align="right">{ note }</Text> }
          </Text>
        </Flex>
      </GridItem>
      <GridItem
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        rowGap={ 3 }
        pl={{ base: 7, lg: 0 }}
        py={{ base: 1, lg: 2 }}
        lineHeight={ 5 }
        whiteSpace="nowrap"
        { ...styles }
      >
        { children }
      </GridItem>
    </>
  );
};

export default DetailsInfoItem;
