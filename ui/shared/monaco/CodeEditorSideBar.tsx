import type { HTMLChakraProps } from '@chakra-ui/react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, useBoolean } from '@chakra-ui/react';
import _throttle from 'lodash/throttle';
import React from 'react';

import type { File, Monaco } from './types';

import CodeEditorFileExplorer from './CodeEditorFileExplorer';
import CodeEditorSearch from './CodeEditorSearch';
import useThemeColors from './utils/useThemeColors';

interface Props {
  monaco: Monaco | undefined;
  data: Array<File>;
  onFileSelect: (index: number, lineNumber?: number) => void;
  selectedFile: string;
}

const CONTAINER_WIDTH = 250;

const CodeEditorSideBar = ({ onFileSelect, data, monaco, selectedFile }: Props) => {

  const [ isStuck, setIsStuck ] = React.useState(false);
  const [ isDrawerOpen, setIsDrawerOpen ] = useBoolean(false);

  const themeColors = useThemeColors();

  const tabProps: HTMLChakraProps<'button'> = {
    fontFamily: 'heading',
    textTransform: 'uppercase',
    fontSize: '11px',
    lineHeight: '35px',
    fontWeight: 500,
    color: themeColors['tab.inactiveForeground'],
    _selected: {
      color: themeColors['tab.activeForeground'],
    },
    px: 0,
    letterSpacing: 0.3,
  };

  const handleScrollThrottled = React.useRef(_throttle((event: React.SyntheticEvent) => {
    setIsStuck((event.target as HTMLDivElement).scrollTop > 0);
  }, 100));

  const handleFileSelect = React.useCallback((index: number, lineNumber?: number) => {
    isDrawerOpen && setIsDrawerOpen.off();
    onFileSelect(index, lineNumber);
  }, [ isDrawerOpen, onFileSelect, setIsDrawerOpen ]);

  return (
    <>
      <Box
        w={ `${ CONTAINER_WIDTH }px` }
        flexShrink={ 0 }
        bgColor={ themeColors['sideBar.background'] }
        fontSize="13px"
        overflowY="scroll"
        onScroll={ handleScrollThrottled.current }
        position={{ base: 'absolute', lg: 'static' }}
        right={{ base: isDrawerOpen ? '0' : `-${ CONTAINER_WIDTH }px`, lg: undefined }}
        top={{ base: 0, lg: undefined }}
        h="100%"
        pb="22px"
        boxShadow={{ base: isDrawerOpen ? 'md' : 'none', lg: 'none' }}
        zIndex={{ base: '2', lg: undefined }}
        transitionProperty="right"
        transitionDuration="normal"
        transitionTimingFunction="ease-in-out"
        borderTopRightRadius="md"
        borderBottomRightRadius="md"
      >
        <Tabs isLazy lazyBehavior="keepMounted" variant="unstyled" size="13px">
          <TabList
            columnGap={ 3 }
            position="sticky"
            top={ 0 }
            left={ 0 }
            bgColor={ themeColors['sideBar.background'] }
            zIndex="1"
            px={ 2 }
            boxShadow={ isStuck ? 'md' : 'none' }
            borderTopRightRadius="md"
          >
            <Tab { ...tabProps }>Explorer</Tab>
            <Tab { ...tabProps }>Search</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={ 0 }>
              <CodeEditorFileExplorer data={ data } onFileSelect={ handleFileSelect } selectedFile={ selectedFile }/>
            </TabPanel>
            <TabPanel p={ 0 }>
              <CodeEditorSearch data={ data } onFileSelect={ handleFileSelect } monaco={ monaco } isInputStuck={ isStuck }/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Box
        boxSize="24px"
        p="4px"
        position="absolute"
        display={{ base: 'block', lg: 'none' }}
        right={ isDrawerOpen ? `${ CONTAINER_WIDTH - 1 }px` : '0' }
        top="calc(50% - 12px)"
        backgroundColor={ themeColors['sideBar.background'] }
        borderTopLeftRadius="4px"
        borderBottomLeftRadius="4px"
        boxShadow="md"
        onClick={ setIsDrawerOpen.toggle }
        zIndex="1"
        transitionProperty="right"
        transitionDuration="normal"
        transitionTimingFunction="ease-in-out"
        title={ isDrawerOpen ? 'Open sidebar' : 'Close sidebar' }
        aria-label={ isDrawerOpen ? 'Open sidebar' : 'Close sidebar' }
      >
        <Box
          className="codicon codicon-tree-item-expanded"
          transform={ isDrawerOpen ? 'rotate(-90deg)' : 'rotate(+90deg)' }
          boxSize="16px"
        />
      </Box>
    </>
  );
};

export default React.memo(CodeEditorSideBar);
