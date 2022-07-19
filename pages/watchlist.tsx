import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head'

import WatchList from 'ui/pages/Watchlist';

const WatchListPage: NextPage = () => {
  return (
    <>
      <Head><title>Watch list</title></Head>
      <WatchList/>
    </>
  );
}

export default WatchListPage
