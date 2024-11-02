// TestSidebar.js
import React, { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const TestSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${isExpanded ? 'col-md-2' : 'col-auto'} m-0 p-0`}>
      <div className="sidebar-wrapper">
        <div className="min-vh-100 border border-info p-0 m-0 bg-dark text-white">
          {/* Toggle Button */}
          <div className="p-3 border-bottom">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={toggleSidebar}
            >
              <MenuIcon />
            </button>
          </div>

          {/* Menu Items */}
          <div className="nav flex-column">
            <div className="nav-item">
              <a className="nav-link text-white d-flex align-items-center p-3 hover-bg-light-hover" href="#">
                <DashboardIcon />
                {isExpanded && <span className="ms-3">Dashboard</span>}
              </a>
            </div>

            <div className="nav-item">
              <a className="nav-link text-white d-flex align-items-center p-3 hover-bg-light-hover" href="#">
                <PersonIcon />
                {isExpanded && <span className="ms-3">Profile</span>}
              </a>
            </div>

            <div className="nav-item">
              <a className="nav-link text-white d-flex align-items-center p-3 hover-bg-light-hover" href="#">
                <AnalyticsIcon />
                {isExpanded && <span className="ms-3">Analytics</span>}
              </a>
            </div>

            <div className="nav-item">
              <a className="nav-link text-white d-flex align-items-center p-3 hover-bg-light-hover" href="#">
                <SettingsIcon />
                {isExpanded && <span className="ms-3">Settings</span>}
              </a>
            </div>

            {/* Logout at bottom */}
            <div className="nav-item mt-auto">
              <a className="nav-link text-white d-flex align-items-center p-3 hover-bg-light-hover" href="#">
                <LogoutIcon />
                {isExpanded && <span className="ms-3">Logout</span>}
              </a>
            </div>
          </div>
        </div>

        {/* Add custom styles */}
        <style>
          {`
                    .sidebar-wrapper {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: ${isExpanded ? '16.666667%' : '80px'};
                        height: 100vh;
                        background-color: #212529;
                        transition: width 0.3s ease;
                        z-index: 1030;
                    }
                    .hover-bg-light-hover:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }
                `}
        </style>
      </div>
    </div>
  );
};

export default TestSidebar;