import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl', // للـ RTL عربي
  palette: {
    primary: {
      main: '#0865A8', // اللون الجديد
    },
    background: {
      default: '#F5F7E1', // Body background
      paper: '#ffffff', // Cards and sections
    },
    grey: {
      300: '#D9D9D9', // Footer color
    },
  },
  typography: {
    fontFamily: '"Cairo", "Roboto", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#393939', // Navbar
        },
      },
    },
    MuiFooter: { // لو عندك Footer component
      styleOverrides: {
        root: {
          backgroundColor: '#D9D9D9',
          color: '#393939',
        },
      },
    },
  },
});

export default theme;