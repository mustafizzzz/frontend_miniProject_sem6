import React, { useState } from 'react'
import SidebarComponent from './../SidebarComponent/SidebarComponent';
import NavTopComponent from '../NavTopComponent/NavTopComponent';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className='container-fluid dashboard-layout'>

      <div className="row navbar-content">
        <div className="col-12 p-0">
          <NavTopComponent />
        </div>
      </div>
      <div className="row sidebar-content">
        <div className="col-2 mt-4 p-0">
          <SidebarComponent />
        </div>
        <div className="col-10 mt-4 child-content-dashboard">
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout