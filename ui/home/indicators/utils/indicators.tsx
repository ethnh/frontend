import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { TChainIndicator } from '../types';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import globeIcon from 'icons/globe.svg';
import txIcon from 'icons/transactions.svg';
import { shortenNumberWithLetter } from 'lib/formatters';
import { sortByDateDesc } from 'ui/shared/chart/utils/sorts';
const COLOR = '#439AE2';

const dailyTxsIndicator: TChainIndicator<QueryKeys.chartsTxs> = {
  id: 'daily_txs',
  title: 'Daily transactions',
  value: '1,531.14 M',
  icon: <Icon as={ txIcon } boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
  hint: `The total daily number of transactions on the blockchain for the last month.`,
  api: {
    queryName: QueryKeys.chartsTxs,
    path: '/node-api/stats/charts/transactions',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: item.tx_count }))
        .sort(sortByDateDesc),
      name: 'Tx/day',
      color: COLOR,
      valueFormatter: (x) => '$' + shortenNumberWithLetter(x),
    } ]),
  },
};

const coinPriceIndicator: TChainIndicator<QueryKeys.chartsMarket> = {
  id: 'coin_price',
  title: `${ appConfig.network.currency.symbol } price`,
  value: '$0.998566',
  // todo_tom change to TokenLogo after token-transfers branch merge
  icon: <Icon as={ globeIcon } boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
  hint: `${ appConfig.network.currency.symbol } daily price in USD.`,
  api: {
    queryName: QueryKeys.chartsMarket,
    path: '/node-api/stats/charts/market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: Number(item.closing_price) }))
        .sort(sortByDateDesc),
      name: `${ appConfig.network.currency.symbol } price`,
      color: COLOR,
      valueFormatter: (x) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    } ]),
  },
};

const marketPriceIndicator: TChainIndicator<QueryKeys.chartsMarket> = {
  id: 'market_cup',
  title: 'Market cap',
  value: '$379M',
  icon: <Icon as={ globeIcon } boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
  // eslint-disable-next-line max-len
  hint: 'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.',
  api: {
    queryName: QueryKeys.chartsMarket,
    path: '/node-api/stats/charts/market',
    dataFn: (response) => ([ {
      items: response.chart_data
        .map((item) => ({ date: new Date(item.date), value: Number(item.closing_price) * Number(response.available_supply) }))
        .sort(sortByDateDesc),
      name: 'Market cap',
      color: COLOR,
      valueFormatter: (x) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    } ]),
  },
};

const INDICATORS = [
  dailyTxsIndicator,
  coinPriceIndicator,
  marketPriceIndicator,
];

export default INDICATORS;
