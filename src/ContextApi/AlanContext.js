import React from 'react'
import { createContext, useEffect, useState } from "react";

export const AlanContext = createContext();

const AlanProvider = ({ children }) => {
  const [loginUserName, setLoginUserName] = useState('');
  const [imageVerify, setImageVerify] = useState(false);



  return (
    <AlanContext.Provider value={{ loginUserName, setLoginUserName, imageVerify, setImageVerify }}>
      {children}
    </AlanContext.Provider>
  )
}

export default AlanProvider;