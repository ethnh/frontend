import { Popover, PopoverTrigger, Box } from '@chakra-ui/react';
import React from 'react';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuPopup from './NetworkMenuPopup';

interface Props {
  isCollapsed: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {
  return (
    <Popover openDelay={ 300 } placement="right-start" gutter={ 22 } isLazy>
      <PopoverTrigger>
        <Box>
          <NetworkMenuButton isCollapsed={ isCollapsed }/>
        </Box>
      </PopoverTrigger>
      <NetworkMenuPopup/>
    </Popover>
  );
};

export default React.memo(NetworkMenu);
