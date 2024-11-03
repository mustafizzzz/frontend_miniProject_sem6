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
import { Bell, Plus, Search } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import CreateInstantMeet from '../CreateInstantMeet/CreateInstantMeet';

const settings = ['Profile', 'Setting', 'Logout'];

const NavTopComponent = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const userInitial = currentUser.userName ? currentUser.userName.charAt(0).toUpperCase() : '';
  const [avatarUrl, setAvatarUrl] = useState('');
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

  const [createMeetAnchorEl, setCreateMeetAnchorEl] = useState(null);
  const [openInstantMeetDialog, setOpenInstantMeetDialog] = useState(false);

  const handleCreateMeetClick = (event) => {
    setCreateMeetAnchorEl(event.currentTarget);
  };

  const handleCreateMeetClose = () => {
    setOpenInstantMeetDialog(true);
    setCreateMeetAnchorEl(null);
  };

  const handleInstantMeetCloseDialog = () => {
    setOpenInstantMeetDialog(false);
  };

  useEffect(() => {
    const gender = Math.random() > 0.5 ? 'men' : 'women'; // Randomly choose gender
    const id = Math.floor(Math.random() * 100); // Random ID between 0-99
    setAvatarUrl(`https://randomuser.me/api/portraits/${gender}/${id}.jpg`);
  }, []);

  return (
    <nav className="navbar navbar-top-box navbar-expand-lg bg-white border-bottom px-4 py-3 mb-4">
      <div className="container-fluid bg-white m-0 p-0">

        {/* Search Bar */}
        <div className="search-wrapper position-relative flex-grow-1 me-4">
          <Search className="search-icon position-absolute text-muted" size={20} />
          <input
            type="text"
            className="form-control form-control-lg bg-light border-0 ps-5"
            placeholder="Search"
          />
        </div>

        {/* Right Side Icons */}
        <div className="d-flex align-items-center gap-3">

          {/* New Meet Button */}
          <button className="btn btn-create-meet px-3 d-flex align-items-center gap-1"
            onClick={handleCreateMeetClick}>
            <Plus size={20} />
            <span>Create meet</span>
          </button>
          {/* Material UI Menu for Dropdown */}
          <Menu

            anchorEl={createMeetAnchorEl}
            open={Boolean(createMeetAnchorEl)}
            onClose={handleCreateMeetClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleCreateMeetClose}>Start an Instant Meet</MenuItem>
            <MenuItem onClick={handleCreateMeetClose}>Schedule a Meet</MenuItem>
          </Menu>

          {/* Create meet dialoug */}
          <CreateInstantMeet open={openInstantMeetDialog} onClose={handleInstantMeetCloseDialog} />

          {/* Notification Button */}
          <button className="btn  btn-notify">
            <Bell size={20} />
          </button>

          {/* Profile Picture */}
          <button className="btn btn-icon">
            <div className="avatar">
              <img
                src={avatarUrl}
                alt="Profile"
                className="rounded-circle"
              />
            </div>
          </button>

        </div>
      </div>
    </nav>
  );
}

export default NavTopComponent