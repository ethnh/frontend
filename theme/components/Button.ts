import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
import { runIfFn } from '@chakra-ui/utils';

const variantSolid = defineStyle((props) => {
  const { colorScheme: c } = props;

  if (c === 'gray') {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props);

    return {
      bg,
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        _disabled: {
          bg,
        },
      },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
    };
  }

  const bg = `${ c }.600`;
  const color = 'white';
  const hoverBg = `${ c }.400`;
  const activeBg = `${ c }.700`;

  return {
    bg,
    color,
    _hover: {
      bg: hoverBg,
      _disabled: {
        bg,
      },
    },
    _disabled: {
      opacity: 0.2,
    },
    _active: { bg: activeBg },
    fontWeight: 600,
  };
});

const variantOutline = defineStyle((props) => {
  const { colorScheme: c } = props;

  const isGrayTheme = c === 'gray' || c === 'gray-dark';
  const color = isGrayTheme ? mode('blackAlpha.800', 'whiteAlpha.800')(props) : mode(`${ c }.600`, `${ c }.300`)(props);
  const borderColor = isGrayTheme ? mode('gray.200', 'gray.600')(props) : mode(`${ c }.600`, `${ c }.300`)(props);
  const activeBg = isGrayTheme ? mode('blue.50', 'gray.600')(props) : mode(`${ c }.50`, 'gray.600')(props);
  const activeColor = (() => {
    if (c === 'gray') {
      return mode('blue.400', 'gray.50')(props);
    }
    if (c === 'gray-dark') {
      return mode('blue.700', 'gray.50')(props);
    }
    return 'blue.400';
  })();

  return {
    color,
    fontWeight: props.fontWeight || 600,
    borderWidth: props.borderWidth || '2px',
    borderStyle: 'solid',
    borderColor,
    bg: 'transparent',
    _hover: {
      color: 'blue.400',
      borderColor: 'blue.400',
      bg: 'transparent',
      _active: {
        bg: props.isActive ? activeBg : 'transparent',
        borderColor: props.isActive ? activeBg : 'blue.400',
        color: props.isActive ? activeColor : 'blue.400',
      },
    },
    _disabled: {
      opacity: 0.2,
    },
    _active: {
      bg: activeBg,
      borderColor: activeBg,
      color: activeColor,
    },
  };
});

const variantSimple = defineStyle((props) => {
  const outline = runIfFn(variantOutline, props);

  return {
    color: outline.color,
    _hover: {
      color: outline._hover.color,
    },
  };
});

const variants = {
  solid: variantSolid,
  outline: variantOutline,
  simple: variantSimple,
};

const baseStyle = defineStyle({
  fontWeight: 600,
  borderRadius: 'base',
});

const sizes = {
  lg: defineStyle({
    h: 12,
    minW: 'unset',
    fontSize: 'lg',
    px: 6,
  }),
  md: defineStyle({
    h: 10,
    minW: 'unset',
    fontSize: 'md',
    px: 4,
  }),
  sm: defineStyle({
    h: 8,
    minW: 'unset',
    fontSize: 'sm',
    px: 3,
  }),
  xs: defineStyle({
    h: 6,
    minW: 'unset',
    fontSize: 'xs',
    px: 2,
  }),
};

const Button = defineStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    variant: 'solid',
    size: 'md',
    colorScheme: 'blue',
  },
});

export default Button;
