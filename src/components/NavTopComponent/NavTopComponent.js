import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import './NavTopComponent.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../ContextApi/userContex';
import logo from '../../assets/moodlens_logo1.PNG'

const settings = ['Profile', 'Account', 'Logout'];

const NavTopComponent = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const userInitial = currentUser.userName ? currentUser.userName.charAt(0).toUpperCase() : '';
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    console.log('setting:', setting);
    if (setting === 'Logout') {
      localStorage.removeItem('user');
      setCurrentUser(null);
      navigate('/login');
    }
    setAnchorElUser(null);
  };

  return (
    <div className="navbar-top-main-box">
      <AppBar position="static" sx={{ backgroundColor: '#F1F8F8', boxShadow: 2 }}  >
        <Container maxWidth="xxl">

          <Toolbar disableGutters>

            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}

            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Lexend',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
                flexGrow: 1,
                alignItems: 'center', // Center the logo vertically
              }}
            >
              {logo ? (<img src={logo} alt="Logo" className='moodlens-logo' />) : 'LOGO'}
            </Typography>

            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Lexend',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>

            <div className="meeting-creat-join-btn me-3 p-2 d-flex align-items-center">

              <button
                type="button"
                className={`${currentUser.role === 'teacher' ? '' : 'd-none'} btn btn-primary me-3 create-meet`}
                onClick={() => navigate('/dashboard/create-meet')}>
                Create meet
              </button>

              <button
                type="button"
                className="btn btn btn-outline-secondary join-meet"
                onClick={() => navigate('/dashboard/join-meet')}
              >
                Join meet
              </button>

              <button
                type="button"
                className="btn  join-meet-notification ms-3"
              >
                <i className="bi bi-bell"></i>
              </button>
              <p className='user-name-navbar m-0 p-0 ms-3'>Hey, {currentUser?.userName || 'username'}</p>


            </div>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={`${userInitial || "Remy Sharp"}`} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)} >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </div >
  );
}

export default NavTopComponent