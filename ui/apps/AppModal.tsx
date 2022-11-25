import {
  Box, Flex, Heading, Icon, IconButton, Image, Link, List, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tag, Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { AppItemOverview, MarketplaceCategoriesIds } from 'types/client/apps';

import appConfig from 'configs/app/config';
import linkIcon from 'icons/link.svg';
import ghIcon from 'icons/social/git.svg';
import tgIcon from 'icons/social/telega.svg';
import twIcon from 'icons/social/tweet.svg';
import starFilledIcon from 'icons/star_filled.svg';
import starOutlineIcon from 'icons/star_outline.svg';
import { nbsp } from 'lib/html-entities';
import notEmpty from 'lib/notEmpty';

import AppModalLink from './AppModalLink';
import { APP_CATEGORIES } from './constants';

type Props = {
  id: string;
  onClose: () => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
}

const AppModal = ({
  id,
  onClose,
  isFavorite,
  onFavoriteClick,
}: Props) => {
  const {
    title,
    url,
    external,
    author,
    description,
    site,
    github,
    telegram,
    twitter,
    logo,
    categories,
  } = appConfig.marketplaceAppList.find(app => app.id === id) as AppItemOverview;

  const socialLinks = [
    telegram ? {
      icon: tgIcon,
      url: telegram,
    } : null,
    twitter ? {
      icon: twIcon,
      url: twitter,
    } : null,
    github ? {
      icon: ghIcon,
      url: github,
    } : null,
  ].filter(notEmpty);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite);
  }, [ onFavoriteClick, id, isFavorite ]);

  return (
    <Modal
      isOpen={ Boolean(id) }
      onClose={ onClose }
      size={{ base: 'full', lg: 'md' }}
      isCentered
    >
      <ModalOverlay/>

      <ModalContent>
        <ModalHeader
          display="grid"
          gridTemplateColumns={{ base: 'auto 1fr' }}
          paddingRight={{ sm: 12 }}
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            w={{ base: '72px', sm: '144px' }}
            h={{ base: '72px', sm: '144px' }}
            marginRight={{ base: 6, sm: 8 }}
            gridRow={{ base: '1 / 3', sm: '1 / 4' }}
          >
            <Image
              src={ logo }
              alt={ `${ title } app icon` }
            />
          </Flex>

          <Heading
            as="h2"
            gridColumn={ 2 }
            fontSize={{ base: '2xl', sm: '3xl' }}
            fontWeight="medium"
            lineHeight={ 1 }
            color="blue.600"
          >
            { title }
          </Heading>

          <Text
            variant="secondary"
            gridColumn={ 2 }
            fontSize="sm"
            fontWeight="normal"
            lineHeight={ 1 }
          >
            By{ nbsp }{ author }
          </Text>

          <Box
            gridColumn={{ base: '1 / 3', sm: 2 }}
            marginTop={{ base: 6, sm: 0 }}
          >
            <Box display="flex">
              <AppModalLink
                id={ id }
                url={ url }
                external={ external }
                title={ title }
              />

              <IconButton
                aria-label="Mark as favorite"
                title="Mark as favorite"
                variant="outline"
                colorScheme="gray"
                w={ 9 }
                h={ 8 }
                onClick={ handleFavoriteClick }
                icon={ isFavorite ?
                  <Icon as={ starFilledIcon } w={ 4 } h={ 4 } color="yellow.400"/> :
                  <Icon as={ starOutlineIcon } w={ 4 } h={ 4 } color="gray.300"/> }
              />
            </Box>
          </Box>
        </ModalHeader>

        <ModalCloseButton/>

        <ModalBody>
          <Heading
            as="h3"
            fontSize="2xl"
            marginBottom={ 4 }
          >
            Overview
          </Heading>

          <Box marginBottom={ 2 }>
            { categories.map((category: MarketplaceCategoriesIds) => APP_CATEGORIES[category] && (
              <Tag
                colorScheme="blue"
                marginRight={ 2 }
                marginBottom={ 2 }
                key={ category }
              >
                { APP_CATEGORIES[category] }
              </Tag>
            )) }
          </Box>

          <Text>{ description }</Text>
        </ModalBody>

        <ModalFooter
          display="flex"
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems={{ base: 'flex-start', sm: 'center' }}
        >
          { site && (
            <Link
              isExternal
              href={ site }
              display="flex"
              alignItems="center"
              paddingRight={{ sm: 2 }}
              marginBottom={{ base: 3, sm: 0 }}
              maxW="100%"
              overflow="hidden"
            >
              <Icon
                as={ linkIcon }
                display="inline"
                verticalAlign="baseline"
                boxSize="18px"
                marginRight={ 2 }
              />

              <Text
                color="inherit"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                { site }
              </Text>
            </Link>
          ) }

          { socialLinks.length > 0 && (
            <List
              marginLeft={{ sm: 'auto' }}
              display="grid"
              gridAutoFlow="column"
              columnGap={ 2 }
            >
              { socialLinks.map(({ icon, url }) => (
                <Link
                  aria-label={ `Link to ${ url }` }
                  title={ url }
                  key={ url }
                  href={ url }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  isExternal
                  w={ 10 }
                  h={ 10 }
                >
                  <Icon
                    as={ icon }
                    w="20px"
                    h="20px"
                    display="block"
                  />
                </Link>
              )) }
            </List>
          ) }
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AppModal;
