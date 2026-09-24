// theme.ts — direção "editorial de dev": base neutra quente + um único acento (tijolo)
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // Gera CSS variables e troca claro/escuro via prefers-color-scheme, sem flash
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#17171a', contrastText: '#f6f5f1' }, // ink
        secondary: { main: '#c4441b', dark: '#a63814', contrastText: '#ffffff' }, // accent
        background: { default: '#f6f5f1', paper: '#ffffff' },
        text: { primary: '#17171a', secondary: '#55555c', disabled: '#6b6b72' },
        divider: '#e2e1da',
      },
    },
    dark: {
      palette: {
        primary: { main: '#f1f0ec', contrastText: '#111113' },
        secondary: { main: '#f0683c', dark: '#d9552b', contrastText: '#111113' },
        background: { default: '#111113', paper: '#18181b' },
        text: { primary: '#f1f0ec', secondary: '#a8a8ae', disabled: '#8e8e95' },
        divider: '#2a2a2f',
      },
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'var(--font-geist), system-ui, sans-serif',
    fontWeightMedium: 500,
    h1: { fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05 },
    h2: { fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05 },
    h3: { fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h4: { fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h5: { fontWeight: 600, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: 0 },
  },
  components: {
    // Sem o overlay claro que o MUI aplica a superfícies elevadas no modo escuro
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          transition: 'transform .12s ease, background-color .15s ease',
          '&:active': { transform: 'scale(.97)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', borderRadius: 6 },
      },
    },
  },
});

export default theme;
