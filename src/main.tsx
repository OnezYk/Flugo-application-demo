// React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// MUI
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

// Componentes
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthProvider.tsx';

// Definição da paleta de cores
export const theme = createTheme({
  palette: {
    primary: { 
      main: '#22c55e',
      light: '#58d385',
      contrastText: '#ffffff'
     },
     success: {
      main:'#04c950',
      light: '#def7e7'
     },
     error: {
      main: '#ff0303',
      light: '#ffe4de'
     },
    text: {
      primary: '#1a1f22',
      secondary: '#637381',
      disabled: '#f0f2f5'
    },
    action: {
      hover: '#c3c4c7'
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
)
