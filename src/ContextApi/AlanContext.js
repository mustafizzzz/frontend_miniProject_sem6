// import React, { useRef } from 'react'
// import { createContext, useEffect, useState } from "react";

// export const AlanContext = createContext();

// const AlanProvider = ({ children }) => {
//   const [loginUserNameAlan, setLoginUserNameAlan] = useState('');
//   const [loginStatusAlan, setLoginStatusAlan] = useState(false);
//   const [loginAlanType, setLoginAlanType] = useState('');
//   const [showFormAlan, setShowFormAlan] = useState(false);
//   const [isAlanActive, setIsAlanActive] = useState(false);
//   const [joinCodeAlan, setJoinCodeAlan] = useState(0);
//   const loginButtonRef = useRef(null);

//   //image verify modal in login page
//   const [openAlan, setOpenAlan] = useState(false);
//   const handleOpenAlanCapture = () => setOpenAlan(true);
//   const handleCloseAlanCapture = () => setOpenAlan(false);




//   return (
//     <AlanContext.Provider value={{
//       loginUserNameAlan, setLoginUserNameAlan,
//       openAlan, setOpenAlan, handleOpenAlanCapture, handleCloseAlanCapture,
//       loginStatusAlan, setLoginStatusAlan,
//       loginAlanType, setLoginAlanType,
//       showFormAlan, setShowFormAlan,
//       isAlanActive, setIsAlanActive, loginButtonRef,
//       joinCodeAlan, setJoinCodeAlan
//     }}>
//       {children}
//     </AlanContext.Provider>
//   )
// }

// export default AlanProvider;