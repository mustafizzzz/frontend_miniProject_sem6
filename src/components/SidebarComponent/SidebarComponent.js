import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './SidebarComponent.css';

const SidebarComponent = () => {

  return (

    <div className="sidebar-in-box ">
      <div className="sidebar">

        <ul className="sidebar-nav px-md-4 px-1">
          <li>
            <NavLink to="/dashboard/home" activeClassname="active"  >
              <i className="bi bi-house"></i>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/meetings" activeClassname="active">
              <i className="bi bi-mic"></i>
              Meetings
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/reports" activeClassname="active">
              <i className="bi bi-bar-chart"></i>
              Reports
            </NavLink>
          </li>

          {/* <li>
            <NavLink to="/dashboard/feedback" activeClassname="active">
              Feedback
            </NavLink>
          </li> */}

          <li>
            <NavLink to="/dashboard/setting" activeClassname="active">
              <i className="bi bi-gear"></i>
              Settings
            </NavLink>
          </li>
        </ul>
        {/* <div className="contact-us">
          <Link to="/contact">Contact Us</Link>
        </div> */}
      </div>

    </div >

  );
}

export default SidebarComponent;
