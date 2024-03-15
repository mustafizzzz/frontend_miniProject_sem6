import React from 'react'
import { createContext, useEffect, useState } from "react";

export const AlanContext = createContext();

const AlanProvider = ({ children }) => {
  const [loginUserName, setLoginUserName] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);

  //image verify modal in login page
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);




  return (
    <AlanContext.Provider value={{ loginUserName, setLoginUserName, open, setOpen, handleOpen, handleClose, loginStatus, setLoginStatus }}>
      {children}
    </AlanContext.Provider>
  )
}

export default AlanProvider;