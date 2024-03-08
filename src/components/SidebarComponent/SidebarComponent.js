import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './SidebarComponent.css';

const SidebarComponent = () => {

  return (

    <div className="sidebar-in-box ">
      <div className={`sidebar`}>

        <ul className="sidebar-nav px-md-4 px-1">
          <li>
            <NavLink to="/dashboard/home" activeclassname="active"  >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/meetings" activeclassname="active">
              Meetings
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/reports" activeclassname="active">
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink to="/feedback" activeclassname="active">
              Feedback
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" activeclassname="active">
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
