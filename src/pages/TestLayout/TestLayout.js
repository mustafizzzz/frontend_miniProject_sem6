// src/components/TestLayout/TestLayout.js
import React, { useState } from 'react';
import NavbarTest from '../NavbarTest/NavbarTest';
import TestSidebar from '../SidebarTest/TestSidebar';
import { Outlet } from 'react-router-dom';


// TestLayout.js
const TestLayout = ({ children }) => {
    return (
        <div className="container-fluid p-0 m-0">
            <div className="row p-0 m-0">
                <TestSidebar />
                <div className="col p-0 m-0 border border-3 border-danger">
                    <NavbarTest />
                    <main className="content-wrapper">
                        <div className="content-scroll">
                            {children ? children : <Outlet />}
                        </div>
                    </main>
                </div>
            </div>

            {/* Add required CSS */}
            <style>
                {`
                    .content-wrapper {
                       
                        overflow: hidden;
                    }
                    .content-scroll {
                        height: 100%;
                        overflow-y: auto;
                        padding: 20px;
                    }
                `}
            </style>

        </div>
    );
};

export default TestLayout;