import type { TokenCounters, TokenHolder, TokenInfo } from 'types/api/token';

export const TOKEN_INFO: TokenInfo<'ERC-20'> = {
  address: '0x2B51Ae4412F79c3c1cB12AA40Ea4ECEb4e80511a',
  decimals: '18',
  exchange_rate: null,
  holders: '16026',
  name: 'Stub Token (goerli)',
  symbol: 'STUB',
  total_supply: '6000000000000000',
  type: 'ERC-20',
};

export const TOKEN_COUNTERS: TokenCounters = {
  token_holders_count: '123456',
  transfers_count: '123456',
};

export const TOKEN_HOLDER: TokenHolder = {
  address: {
    hash: '0x2B51Ae4412F79c3c1cB12AA40Ea4ECEb4e80511a',
    implementation_name: null,
    is_contract: false,
    is_verified: null,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  value: '1021378038331138520668',
};
