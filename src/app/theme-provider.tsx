'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'sonner';
import theme from '../theme';
import { AuthProvider } from './context/AuthContext';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <AuthProvider>{children}</AuthProvider>
      <Toaster
        theme="system"
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-geist), system-ui, sans-serif',
            background: 'var(--mui-palette-background-paper)',
            color: 'var(--mui-palette-text-primary)',
            border: '1px solid var(--mui-palette-divider)',
          },
        }}
      />
    </ThemeProvider>
  );
}
