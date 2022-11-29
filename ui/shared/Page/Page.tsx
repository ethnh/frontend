import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import AppError from 'ui/shared/AppError/AppError';
import ErrorBoundary from 'ui/shared/ErrorBoundary';
import PageContent from 'ui/shared/Page/PageContent';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
  wrapChildren?: boolean;
  hideMobileHeaderOnScrollDown?: boolean;
  isHomePage?: boolean;
}

const Page = ({
  children,
  wrapChildren = true,
  hideMobileHeaderOnScrollDown,
  isHomePage,
}: Props) => {
  const fetch = useFetch();

  useQuery<unknown, unknown, unknown>([ QueryKeys.csrf ], async() => await fetch('/node-api/account/csrf'), {
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });

  const renderErrorScreen = React.useCallback(() => {
    return wrapChildren ?
      <PageContent isHomePage={ isHomePage }><AppError statusCode={ 500 } mt="50px"/></PageContent> :
      <AppError statusCode={ 500 }/>;
  }, [ isHomePage, wrapChildren ]);

  const renderedChildren = wrapChildren ? (
    <PageContent isHomePage={ isHomePage }>{ children }</PageContent>
  ) : children;

  return (
    <Flex w="100%" minH="100vh" alignItems="stretch">
      <NavigationDesktop/>
      <Flex flexDir="column" width="100%">
        <Header isHomePage={ isHomePage } hideOnScrollDown={ hideMobileHeaderOnScrollDown }/>
        <ErrorBoundary renderErrorScreen={ renderErrorScreen }>
          { renderedChildren }
        </ErrorBoundary>
      </Flex>
    </Flex>
  );
};

export default Page;
