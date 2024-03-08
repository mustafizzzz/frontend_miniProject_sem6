import React from 'react'
import { Link } from 'react-router-dom'

const SidebarComponent = () => {
  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        <li>
          <Link to="/help-and-support">Help and Support</Link>
        </li>
        <li>
          <Link to="/dashboard/about-us">About Us</Link>
        </li>
        <li>
          <Link to="/dashboard/contact">Contact</Link>
        </li>
      </ul>
    </div>
  )
}

export default SidebarComponent