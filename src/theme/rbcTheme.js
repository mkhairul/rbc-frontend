import { createTheme } from '@mui/material/styles';

const rbcTheme = createTheme({
  palette: {
    primary: {
      main: '#0051A5',
      light: '#3373B7',
      dark: '#003874',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FECC00',
      light: '#FFD633',
      dark: '#C9A200',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#5C6670',
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#2E7D32',
    },
    divider: '#E0E4E8',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1A1A1A',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    body1: {
      fontSize: '1rem',
      color: '#1A1A1A',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#5C6670',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 8,
        },
        containedPrimary: {
          boxShadow: '0 2px 8px rgba(0, 81, 165, 0.25)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 81, 165, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F7FA',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#1A1A1A',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default rbcTheme;
