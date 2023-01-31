import {
  Box,
  Center,
  chakra,
  Flex,
  Grid,
  Icon,
  IconButton, Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import domToImage from 'dom-to-image';
import React, { useRef, useCallback, useState } from 'react';

import type { TimeChartItem } from './types';

import svgFileIcon from 'icons/files/csv.svg';
import imageIcon from 'icons/files/image.svg';
import repeatArrowIcon from 'icons/repeat_arrow.svg';
import scopeIcon from 'icons/scope.svg';
import dotsIcon from 'icons/vertical_dots.svg';
import dayjs from 'lib/date/dayjs';
import { apos } from 'lib/html-entities';
import saveAsCSV from 'lib/saveAsCSV';

import ChartWidgetGraph from './ChartWidgetGraph';
import ChartWidgetSkeleton from './ChartWidgetSkeleton';
import FullscreenChartModal from './FullscreenChartModal';

type Props = {
  items?: Array<TimeChartItem>;
  title: string;
  description?: string;
  isLoading: boolean;
  className?: string;
  isError: boolean;
}

const DOWNLOAD_IMAGE_SCALE = 5;

const ChartWidget = ({ items, title, description, isLoading, className, isError }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const pngBackgroundColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleZoom = useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomResetClick = useCallback(() => {
    setIsZoomResetInitial(true);
  }, []);

  const showChartFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const clearFullscreenChart = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const handleFileSaveClick = useCallback(() => {
    // wait for context menu to close
    setTimeout(() => {
      if (ref.current) {
        domToImage.toPng(ref.current,
          {
            quality: 100,
            bgcolor: pngBackgroundColor,
            width: ref.current.offsetWidth * DOWNLOAD_IMAGE_SCALE,
            height: ref.current.offsetHeight * DOWNLOAD_IMAGE_SCALE,
            filter: (node) => node.nodeName !== 'BUTTON',
            style: {
              borderColor: 'transparent',
              transform: `scale(${ DOWNLOAD_IMAGE_SCALE })`,
              'transform-origin': 'top left',
            },
          })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `${ title } (Blockscout chart).png`;
            link.href = dataUrl;
            link.click();
            link.remove();
          });
      }
    }, 100);
  }, [ pngBackgroundColor, title ]);

  const handleSVGSavingClick = useCallback(() => {
    if (items) {
      const headerRows = [
        'Date', 'Value',
      ];
      const dataRows = items.map((item) => [
        dayjs(item.date).format('YYYY-MM-DD'), String(item.value),
      ]);

      saveAsCSV(headerRows, dataRows, `${ title } (Blockscout stats)`);
    }
  }, [ items, title ]);

  if (isLoading) {
    return <ChartWidgetSkeleton hasDescription={ Boolean(description) }/>;
  }

  const hasItems = items && items.length > 2;

  const content = (() => {
    if (isError) {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          flexGrow={ 1 }
          py={ 4 }
        >
          <Text
            variant="secondary"
            fontSize="sm"
            textAlign="center"
          >
            { `The data didn${ apos }t load. Please, ` }
            <Link href={ window.document.location.href }>try to reload the page.</Link>
          </Text>
        </Flex>
      );
    }

    if (!hasItems) {
      return (
        <Center flexGrow={ 1 }>
          <Text variant="secondary" fontSize="sm">No data</Text>
        </Center>
      );
    }

    return (
      <Box h="100%" maxW="100%">
        <ChartWidgetGraph
          items={ items }
          onZoom={ handleZoom }
          isZoomResetInitial={ isZoomResetInitial }
          title={ title }
        />
      </Box>
    );
  })();

  return (
    <>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        ref={ ref }
        padding={{ base: 3, lg: 4 }}
        borderRadius="md"
        border="1px"
        borderColor={ borderColor }
        className={ className }
      >
        <Grid
          gridTemplateColumns="auto auto 36px"
          gridColumnGap={ 2 }
        >
          <Text
            fontWeight={ 600 }
            fontSize="md"
            lineHeight={ 6 }
            as="p"
            size={{ base: 'xs', lg: 'sm' }}
          >
            { title }
          </Text>

          { description && (
            <Text
              mb={ 1 }
              gridColumn={ 1 }
              as="p"
              variant="secondary"
              fontSize="xs"
            >
              { description }
            </Text>
          ) }

          <Tooltip label="Reset zoom">
            <IconButton
              hidden={ isZoomResetInitial }
              aria-label="Reset zoom"
              colorScheme="blue"
              w={ 9 }
              h={ 8 }
              gridColumn={ 2 }
              justifySelf="end"
              alignSelf="top"
              gridRow="1/3"
              size="sm"
              variant="outline"
              onClick={ handleZoomResetClick }
              icon={ <Icon as={ repeatArrowIcon } w={ 4 } h={ 4 }/> }
            />
          </Tooltip>

          { hasItems && (
            <Menu>
              <MenuButton
                gridColumn={ 3 }
                gridRow="1/3"
                justifySelf="end"
                w="36px"
                h="32px"
                icon={ <Icon as={ dotsIcon } w={ 4 } h={ 4 }/> }
                colorScheme="gray"
                variant="ghost"
                as={ IconButton }
              >
                <VisuallyHidden>
                  Open chart options menu
                </VisuallyHidden>
              </MenuButton>
              <MenuList>
                <MenuItem
                  display="flex"
                  alignItems="center"
                  onClick={ showChartFullscreen }
                >
                  <Icon as={ scopeIcon } boxSize={ 5 } mr={ 3 }/>
                  View fullscreen
                </MenuItem>

                <MenuItem
                  display="flex"
                  alignItems="center"
                  onClick={ handleFileSaveClick }
                >
                  <Icon as={ imageIcon } boxSize={ 5 } mr={ 3 }/>
                  Save as PNG
                </MenuItem>

                <MenuItem
                  display="flex"
                  alignItems="center"
                  onClick={ handleSVGSavingClick }
                >
                  <Icon as={ svgFileIcon } boxSize={ 5 } mr={ 3 }/>
                  Save as CSV
                </MenuItem>
              </MenuList>
            </Menu>
          ) }
        </Grid>

        { content }
      </Box>

      { hasItems && (
        <FullscreenChartModal
          isOpen={ isFullscreen }
          items={ items }
          title={ title }
          description={ description }
          onClose={ clearFullscreenChart }
        />
      ) }
    </>
  );
};

export default React.memo(chakra(ChartWidget));
