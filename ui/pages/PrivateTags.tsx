import React from 'react';

import {
  Box,
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

import Page from 'ui/shared/Page/Page';
import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';

const PrivateTags: React.FC = () => {
  React.useEffect(() => {
    fetch('/api/account/private-tags/address')
  }, []);

  return (
    <Page>
      <Box h="100%">
        <Heading as="h1" size="lg" marginBottom={ 8 }>Private tags</Heading>
        <Tabs variant="soft-rounded" colorScheme="blue" isLazy>
          <TabList marginBottom={ 8 }>
            <Tab>Address</Tab>
            <Tab>Transaction</Tab>
          </TabList>
          <TabPanels>
            <TabPanel padding={ 0 }>
              <PrivateAddressTags/>
            </TabPanel>
            <TabPanel padding={ 0 }>
              <PrivateTransactionTags/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  );
};

export default PrivateTags
