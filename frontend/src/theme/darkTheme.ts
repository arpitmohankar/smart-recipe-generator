import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121',
      paper: '#2a2a2a'
    },
    primary: {
      main: '#10a37f'
    },
    secondary: {
      main: '#8e8ea0'
    },
    text: {
      primary: '#ececf1',
      secondary: '#c5c5d2'
    }
  },
  typography: {
    fontFamily: '"Söhne", system-ui, -apple-system, sans-serif',
    fontSize: 14,
    body1: {
      lineHeight: 1.5
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '6px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});
