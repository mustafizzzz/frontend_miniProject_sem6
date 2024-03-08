import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './SidebarComponent.css';

const SidebarComponent = () => {

  return (

    <div className="sidebar-in-box">
      <div className={`sidebar`}>

        <ul className="sidebar-nav px-4">
          <li>
            <NavLink to="/dashboard/home" exact activeClassName="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/meetings" activeClassName="active">
              Meetings
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/reports" activeClassName="active">
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink to="/feedback" activeClassName="active">
              Feedback
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" activeClassName="active">
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
