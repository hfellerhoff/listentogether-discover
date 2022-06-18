// theme.ts (Version 2 needs to be a tsx file, due to usage of StyleFunctions)
import { extendTheme } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

// Version 2: Using functions
const theme = extendTheme({
  // styles: {
  //   global: (props: StyleFunctionProps) => ({
  //     body: {
  //       fontFamily: 'body',
  //       color: mode('gray.800', 'whiteAlpha.900')(props),
  //       bg: mode('gray.100', 'gray.800')(props),
  //       lineHeight: 'base',
  //     },
  //   }),
  // },
  fonts: {
    body: 'Lato, sans-serif',
    heading: '"Merriweather", serif',
    mono: 'Menlo, monospace',
  },
});

export default theme;
