import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

const theme = createTheme({
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
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>,
    </BrowserRouter>
  </ThemeProvider>
)
