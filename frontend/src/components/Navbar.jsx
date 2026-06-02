import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const avatarLetter = user?.username?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar" role="banner">
      <div className="navbar-brand" aria-label="TaskPlanet home">
        <RocketLaunchIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5, color: '#9d62f5' }} />
        TaskPlanet
      </div>

      <div className="navbar-user">
        <Tooltip title={user?.email || ''} placement="bottom">
          <Avatar
            src={user?.avatar || ''}
            alt={user?.username}
            sx={{
              width: 34,
              height: 34,
              bgcolor: '#7c3aed',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: '2px solid rgba(124,58,237,0.5)',
            }}
          >
            {avatarLetter}
          </Avatar>
        </Tooltip>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
          {user?.username}
        </span>
        <Tooltip title="Log out">
          <Button
            id="btn-logout"
            onClick={handleLogout}
            size="small"
            variant="outlined"
            startIcon={<LogoutIcon fontSize="small" />}
            sx={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              px: 1.2,
              py: 0.4,
              '&:hover': {
                borderColor: 'var(--accent)',
                color: 'var(--accent-light)',
                background: 'rgba(124,58,237,0.08)',
              },
            }}
          >
            Logout
          </Button>
        </Tooltip>
      </div>
    </nav>
  );
}
