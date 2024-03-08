import React, { useState } from 'react'
import SidebarComponent from './../SidebarComponent/SidebarComponent';
import NavTopComponent from '../NavTopComponent/NavTopComponent';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log('Layouttttt');

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className='container-fluid dashboard-layout'>

      <div className="row navbar-content">
        <div className="col-12 p-0 position-fixed">
          <NavTopComponent />
        </div>
      </div>

      <div className="row sidebar-content">
        <div className="col-4 col-md-2 p-0 position-fixed">
          <SidebarComponent />
        </div>
        <div className="col-8 col-md-10  offset-md-2 offset-4 child-content-dashboard">
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout