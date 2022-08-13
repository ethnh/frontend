import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from './utils/getDefaultTransitionProps';

const global = (props: StyleFunctionProps) => ({
  body: {
    bg: mode('white', 'black')(props),
    ...getDefaultTransitionProps(),
  },
  form: {
    w: '100%',
  },
});

export default global;
