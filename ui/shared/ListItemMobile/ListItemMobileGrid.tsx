import { Grid, chakra, GridItem } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

interface ContainerProps {
  className?: string;
  isAnimated?: boolean;
  children: React.ReactNode;
}

const Container = chakra(({ isAnimated, children, className }: ContainerProps) => {
  return (
    <Grid
      as={ motion.div }
      w="100%"
      initial={ isAnimated ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 } }
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      rowGap={ 2 }
      columnGap={ 2 }
      gridTemplateColumns="86px auto"
      gridTemplateRows="minmax(30px, max-content)"
      paddingY={ 4 }
      borderColor="divider"
      borderTopWidth="1px"
      _last={{
        borderBottomWidth: '1px',
      }}
      className={ className }
      fontSize="sm"
    >
      { children }
    </Grid>
  );
});

interface LabelProps {
  className?: string;
  children: React.ReactNode;
}

const Label = chakra(({ children, className }: LabelProps) => {
  return (
    <GridItem className={ className } fontWeight={ 500 } lineHeight="20px" py="5px">
      { children }
    </GridItem>
  );
});

interface ValueProps {
  className?: string;
  children: React.ReactNode;
}

const Value = chakra(({ children, className }: ValueProps) => {
  return (
    <GridItem
      className={ className }
      py="5px"
      color="text_secondary"
      overflow="hidden"
    >
      { children }
    </GridItem>
  );
});

const ListItemMobileGrid = {
  Container,
  Label,
  Value,
};

export default ListItemMobileGrid;
