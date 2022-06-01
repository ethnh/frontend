import React from 'react';
import type { NextPage } from 'next';
import { Center } from '@chakra-ui/react';
import Page from '../components/Page/Page';

const Home: NextPage = () => {
  return (
    <Page>
      <Center h="100%" bgColor="white" color="black">
        Home Page
      </Center>
    </Page>
  );
};

export default Home
