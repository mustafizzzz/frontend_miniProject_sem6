import React from 'react'
import { createContext, useEffect, useState } from "react";

export const AlanContext = createContext();

const AlanProvider = ({ children }) => {
  const [loginUserName, setLoginUserName] = useState('');
  const [imageVerify, setImageVerify] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);




  return (
    <AlanContext.Provider value={{ loginUserName, setLoginUserName, imageVerify, setImageVerify, open, setOpen, handleOpen, handleClose }}>
      {children}
    </AlanContext.Provider>
  )
}

export default AlanProvider;