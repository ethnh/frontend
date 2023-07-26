import { Box, useColorMode } from '@chakra-ui/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';

import appConfig from 'configs/app/config';
import buildUrl from 'lib/api/buildUrl';
import 'graphiql/graphiql.css';
import isBrowser from 'lib/isBrowser';

const graphQLStyle = {
  '.graphiql-container': {
    backgroundColor: 'unset',
  },
};

const GraphQL = () => {

  const { colorMode } = useColorMode();

  // colorModeState used as a key to re-render GraphiQL conponent after color mode change
  const [ colorModeState, setColorModeState ] = React.useState(colorMode);

  React.useEffect(() => {
    if (isBrowser()) {
      const graphqlTheme = window.localStorage.getItem('graphiql:theme');
      if (graphqlTheme !== colorMode) {
        window.localStorage.setItem('graphiql:theme', colorMode);
        setColorModeState(colorMode);
      }
    }
  }, [ colorMode ]);

  const initialQuery = `{
    transaction(
      hash: "${ appConfig.graphQL.defaultTxnHash }"
    ) {
      hash
      blockNumber
      value
      gasUsed
    }
  }`;

  const graphqlUrl = buildUrl('graphql');

  const fetcher = createGraphiQLFetcher({
    url: graphqlUrl,
    // graphql ws implementation with absinthe plugin is incompatible with graphiql-ws protocol
    // or the older one subscriptions-transport-ws
    // so we (isstuev & vbaranov) decided to configure playground without subscriptions
    // in case of any complaint consider reconfigure the graphql ws server with absinthe_graphql_ws package
    // subscriptionUrl: `wss://${appConfig.app.host}/socket/`,
  });

  return (
    <Box h="100vh" overflowX="scroll" sx={ graphQLStyle }>
      <Box h="100vh" minW="900px" sx={ graphQLStyle }>
        <GraphiQL fetcher={ fetcher } defaultQuery={ initialQuery } key={ colorModeState }/>
      </Box>
    </Box>
  );
};

export default GraphQL;
