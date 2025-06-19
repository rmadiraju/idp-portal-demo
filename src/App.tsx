import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import HelpChat from './components/HelpChat';
import SearchResults from './pages/SearchResults';
import Approvals from './pages/Approvals';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#eb0a1e',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppContent: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  if (!authState.isAuthenticated) {
    return <SignIn />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout >
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/help"
        element={
          <Layout>
            <HelpChat onClose={() => navigate('/')} />
          </Layout>
        }
      />
      <Route
        path="/search"
        element={
          <Layout>
            <SearchResults />
          </Layout>
        }
      />
      <Route
        path="/approvals"
        element={
          <Layout>
            <Approvals />
          </Layout>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router basename="/idp-portal-demo">
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
