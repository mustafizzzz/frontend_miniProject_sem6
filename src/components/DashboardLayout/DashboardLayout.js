import React from 'react'
import SidebarComponent from './../SidebarComponent/SidebarComponent';
import NavTopComponent from '../NavTopComponent/NavTopComponent';
import { Outlet } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  return (
    <>
      <div className="dashboard-layout">
        <SidebarComponent />
        <NavTopComponent />
      </div>
      <div className='dashboard-layout-content'>
        {children ? children : <Outlet />}
      </div>
    </>
  )
}

export default DashboardLayout