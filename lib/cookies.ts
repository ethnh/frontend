import type { Types } from 'typescript-cookie';
import { Cookies } from 'typescript-cookie';

import isBrowser from './isBrowser';

export enum NAMES {
  NAV_BAR_COLLAPSED='nav_bar_collapsed',
  API_TOKEN='_explorer_key',
  TXS_SORT='txs_sort',
  COLOR_MODE='chakra-ui-color-mode',
}

export function get(name?: NAMES | undefined | null, serverCookie?: string) {
  if (!isBrowser()) {
    return serverCookie ? getFromCookieString(serverCookie, name) : undefined;
  }
  return Cookies.get(name);
}

export function set(name: string, value: string, attributes: Types.CookieAttributes = {}) {
  attributes.path = '/';

  return Cookies.set(name, value, attributes);
}

export function getFromCookieString(cookieString: string, name?: NAMES | undefined | null) {
  return cookieString.split(`${ name }=`)[1]?.split(';')[0];
}
