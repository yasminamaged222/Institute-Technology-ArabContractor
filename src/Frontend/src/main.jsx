import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import theme, { cacheRtl } from './theme/theme.js';
import './index.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
                <BrowserRouter>
                    <AuthProvider>
      <div dir="rtl"> {/* <-- مهم جدًا للـ HTML كله */}
         <Navbar />
          <App />
        <Footer />
                        </div>
                    </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);