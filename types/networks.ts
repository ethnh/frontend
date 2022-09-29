import type { FunctionComponent, SVGAttributes } from 'react';

export type NetworkGroup = 'mainnets' | 'testnets' | 'other';

export interface Network {
  name: string;
  chainId: number; // https://chainlist.org/
  currency: string;
  nativeTokenAddress: string;
  shortName?: string;
  // basePath = /<type>/<subType>, e.g. /xdai/mainnet
  type: string;
  subType?: string;
  group: 'mainnets' | 'testnets' | 'other';
  icon?: FunctionComponent<SVGAttributes<SVGElement>> | string;
  logo?: FunctionComponent<SVGAttributes<SVGElement>> | string;
  isAccountSupported?: boolean;
  assetsNamePath?: string;
}
