import { Icon, Box, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import shortLogoPlaceholder from 'icons/networks/icons/placeholder.svg';
import logoPlaceholder from 'icons/networks/logos/blockscout.svg';
import link from 'lib/link/link';
import ASSETS from 'lib/networks/networkAssets';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {
  const logoColor = useColorModeValue('blue.600', 'white');
  const href = link('network_index');

  const style = useColorModeValue({}, { filter: 'brightness(0) invert(1)' });

  const logoEl = (() => {
    if (isCollapsed) {
      const shortLogo = appConfig.network.type ? ASSETS[appConfig.network.type]?.shortLogo || ASSETS[appConfig.network.type]?.icon : undefined;
      return (
        <Icon
          as={ shortLogo || shortLogoPlaceholder }
          width="auto"
          height="100%"
          color={ shortLogo ? undefined : logoColor }
          { ...getDefaultTransitionProps() }
          style={ style }
        />
      );
    }

    if (appConfig.network.logo) {
      return (
        <Image
          w="auto"
          h="100%"
          src={ appConfig.network.logo }
          alt={ `${ appConfig.network.name } network icon` }
        />
      );
    }

    const logo = appConfig.network.type ? ASSETS[appConfig.network.type]?.logo : undefined;
    return (
      <Icon
        as={ logo || logoPlaceholder }
        width="auto"
        height="100%"
        color={ logo ? undefined : logoColor }
        { ...getDefaultTransitionProps() }
        style={ style }
      />
    );
  })();

  return (
    // TODO switch to <NextLink href={ href } passHref> when main page for network will be ready
    <Box
      as="a"
      href={ href }
      width={{ base: 'auto', lg: isCollapsed === false ? '113px' : '30px' }}
      height={ isCollapsed ? '30px' : '20px' }
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
      aria-label="Link to main page"
    >
      { logoEl }
    </Box>
  );
};

export default React.memo(NetworkLogo);
