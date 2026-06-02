import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed',
      light: '#9d62f5',
      dark: '#5b21b6',
    },
    background: {
      default: '#07080d',
      paper: '#13161f',
    },
    text: {
      primary: '#f1f0f5',
      secondary: '#8b8fa8',
    },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '99px',
        },
        contained: {
          background: 'linear-gradient(135deg, #7c3aed, #9d62f5)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7c3aed',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7c3aed',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
  },
});

// Protect route — redirect to /auth if not logged in
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <FeedPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
