import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Flex, Box, VStack, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import * as cookies from 'lib/cookies';
import useNavItems from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NetworkLogo from 'ui/blocks/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/blocks/networkMenu/NetworkMenu';

import NavFooter from './NavFooter';
import NavLink from './NavLink';

const NavigationDesktop = () => {
  const router = useRouter();

  const { mainNavItems, accountNavItems } = useNavItems();
  const isLargeScreen = useBreakpointValue({ base: false, xl: true });
  const cookieValue = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED);

  const [ isCollapsed, setCollapsedState ] = React.useState(cookieValue === 'true');

  React.useEffect(() => {
    if (!cookieValue) {
      setCollapsedState(!isLargeScreen);
    }
  }, [ isLargeScreen, cookieValue ]);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [ isCollapsed ]);

  const containerBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const chevronIconStyles = {
    bgColor: useColorModeValue('white', 'black'),
    color: useColorModeValue('blackAlpha.400', 'whiteAlpha.400'),
    borderColor: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
  };

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      borderRight="1px solid"
      borderColor={ containerBorderColor }
      px={ isCollapsed ? 4 : 6 }
      py={ 12 }
      width={ isCollapsed ? '92px' : '229px' }
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
    >
      <Box
        as="header"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        w="100%"
        px={ 3 }
        h={ 10 }
      >
        <NetworkLogo isCollapsed={ isCollapsed }/>
        <NetworkMenu isCollapsed={ isCollapsed }/>
      </Box>
      <Box as="nav" mt={ 14 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed } isActive={ router.asPath === item.pathname }/>) }
        </VStack>
      </Box>
      <Box as="nav" mt={ 12 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed } isActive={ router.asPath === item.pathname }/>) }
        </VStack>
      </Box>
      <NavFooter isCollapsed={ isCollapsed }/>
      <ChevronLeftIcon
        width={ 6 }
        height={ 6 }
        border="1px"
        _hover={{ color: 'blue.400' }}
        borderRadius="base"
        { ...chevronIconStyles }
        transform={ isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }
        { ...getDefaultTransitionProps({ transitionProperty: 'transform, left' }) }
        transformOrigin="center"
        position="fixed"
        top="104px"
        left={ isCollapsed ? '80px' : '216px' }
        cursor="pointer"
        onClick={ handleTogglerClick }
      />
    </Flex>
  );
};

export default NavigationDesktop;
