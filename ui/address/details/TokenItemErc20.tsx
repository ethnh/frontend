import { Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import TokenLogo from 'ui/shared/TokenLogo';

import TokenItem from './TokenItem';

interface Props {
  data: AddressTokenBalance;
}

const TokenItemErc20 = ({ data }: Props) => {
  const tokenDecimals = Number(data.token.decimals) || 18;

  const { usd } = getCurrencyValue({
    value: data.value,
    accuracyUsd: 2,
    exchangeRate: data.token.exchange_rate,
  });

  return (
    <TokenItem>
      <Flex alignItems="center" w="100%">
        <TokenLogo hash={ data.token.address } name={ data.token.name } boxSize={ 6 }/>
        <Text fontWeight={ 700 } ml={ 2 }>{ data.token.name }</Text>
        { usd && <Text fontWeight={ 700 } ml="auto">${ usd }</Text> }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Text >{ BigNumber(data.value).dividedBy(10 ** tokenDecimals).dp(2).toFormat() } { data.token.symbol }</Text>
        { data.token.exchange_rate && <Text >@{ data.token.exchange_rate }</Text> }
      </Flex>
    </TokenItem>
  );
};

export default React.memo(TokenItemErc20);
