import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [tab, setTab] = useState(0); // 0=login, 1=register
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleTabChange = (_, newVal) => {
    setTab(newVal);
    setForm({ username: '', email: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 0) {
        await login(form.email, form.password);
      } else {
        if (!form.username.trim()) {
          setError('Username is required');
          return;
        }
        await register(form.username.trim(), form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <RocketLaunchIcon sx={{ fontSize: 36, color: '#9d62f5', mb: 0.5 }} />
          <h1>TaskPlanet</h1>
          <p>{tab === 0 ? 'Welcome back! Log in to your account.' : 'Create your account to join the planet.'}</p>
        </div>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)', mb: 2.5 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            TabIndicatorProps={{ style: { background: '#7c3aed', height: 3, borderRadius: 99 } }}
            textColor="inherit"
          >
            <Tab label="Log In" id="tab-login" aria-controls="tabpanel-login" />
            <Tab label="Register" id="tab-register" aria-controls="tabpanel-register" />
          </Tabs>
        </Box>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            {tab === 1 && (
              <TextField
                id="input-username"
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="username"
                inputProps={{ minLength: 3, maxLength: 30 }}
                variant="outlined"
                size="small"
              />
            )}
            <TextField
              id="input-email"
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="email"
              variant="outlined"
              size="small"
            />
            <TextField
              id="input-password"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              autoComplete={tab === 0 ? 'current-password' : 'new-password'}
              variant="outlined"
              size="small"
              inputProps={{ minLength: 6 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              id="btn-submit-auth"
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 0.5 }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: '#fff' }} />
              ) : tab === 0 ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
}
