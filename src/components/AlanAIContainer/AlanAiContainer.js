// import React, { useContext, useEffect, useState } from 'react'
// import alanBtn from '@alan-ai/alan-sdk-web';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { AlanContext } from '../../ContextApi/AlanContext';
// import { set } from 'firebase/database';

// const AlanAiContainer = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     //context import
//     const { loginUserNameAlan, setLoginUserNameAlan,
//         handleOpenAlanCapture,
//         loginStatusAlan, setLoginStatusAlan,
//         isAlanActive, setIsAlanActive,
//         setLoginAlanType,
//         setShowFormAlan, loginButtonRef, joinCodeAlan, setJoinCodeAlan } = useContext(AlanContext);
//     console.log('Neme of user after call.....', loginUserNameAlan);
//     console.log('button.....', loginButtonRef.current);

//     useEffect(() => {
//         window.alanBtnInstance = alanBtn({
//             key: 'ba0a1a712e203cf823cee102dcae85a02e956eca572e1d8b807a3e2338fdd0dc/stage',
//             onButtonState: async (status) => {

//                 // if (status === "ONLINE" && !window.welcomeMsgPlayed) {
//                 //     window.alanBtnInstance.activate();
//                 //     window.alanBtnInstance.playText('You are online now. You can give me commands for your login just say start login.');
//                 //     window.welcomeMsgPlayed = true;
//                 // }
//             },

//             onCommand: (commandData) => {
//                 if (commandData.command === 'start login') {
//                     setLoginAlanType('student')
//                     setShowFormAlan(true);
//                     navigate('/login');
//                 }
//                 if (commandData.command === 'deactivate') {
//                     console.warn('iam dataaaaa');

//                     window.alanBtnInstance.deactivate();
//                 }
//                 if (commandData.command === 'getUsername') {
//                     // console.log('iam dataaaaa', commandData.command.data.value);
//                     const userNametoLower = commandData.data.value.toLowerCase();
//                     setLoginUserNameAlan(userNametoLower);
//                 }
//                 if (commandData.command === 'captureLogin') {
//                     handleOpenAlanCapture();
//                     setTimeout(() => {

//                         if (loginButtonRef.current) {
//                             loginButtonRef.current.click();
//                         }
//                     }, 21000);
//                 }
//                 if (commandData.command === 'loginSucess') {
//                     window.alanBtnInstance.activate();
//                     window.alanBtnInstance.playText('Login successful. press control + right arrow key and Say join meet.');
//                     window.alanBtnInstance.deactivate();

//                 }
//                 if (commandData.command === 'joinMeet') {
//                     navigate('/dashboard/join-meet');
//                     window.alanBtnInstance.activate();
//                     window.alanBtnInstance.playText('Please tell the meeting code to join the meeting.');

//                 }
//                 if (commandData.command === 'inMeet') {
//                     console.log(commandData);
//                     setJoinCodeAlan(commandData.data.value);
//                     setTimeout(() => {
//                         window.location.href = `/room/${commandData.data.value}`;
//                     }, 5000);
//                 }

//                 if (commandData.command === 'leaveMeet') {
//                     window.alanBtnInstance.activate();
//                     window.alanBtnInstance.playText('You are leaving the meeting.');
//                     setTimeout(() => {
//                         window.location.href = '/dashboard';
//                     }, 5000);
//                 }
//                 // if (commandData.command === 'loginStatus') {
//                 //     window.alanBtnInstance.callProjectApi("setLoginStatus", { loginStatus: loginStatusAlan }, function (error, result) { });
//                 // }
//                 console.log(commandData);
//             }
//         });
//     }, []);

//     //send the path to alan
//     useEffect(() => {
//         window.alanBtnInstance.setVisualState({ "path": location.pathname })
//         console.log('%cAlan path', 'color:yellow', location.pathname);
//     }, [location])

//     useEffect(() => {
//         if (loginStatusAlan === true) {
//             console.log('loginStatusAlan', loginStatusAlan);
//             window.alanBtnInstance.activate();
//             window.alanBtnInstance.playText('Login successful. press control + right arrow key and Say join lecture.');
//             window.alanBtnInstance.deactivate();

//         }
//     }, [loginStatusAlan]);



//     //activate and deactivate alan
//     useEffect(() => {
//         const handleKeyPress = (event) => {
//             if (event.ctrlKey && event.code === 'ArrowRight') {
//                 if (isAlanActive) {
//                     setIsAlanActive(false);
//                     window.alanBtnInstance.deactivate();
//                 } else {
//                     setIsAlanActive(true);
//                     window.alanBtnInstance.activate();
//                 }
//             }
//         };

//         document.addEventListener('keydown', handleKeyPress);

//         return () => {
//             document.removeEventListener('keydown', handleKeyPress);
//         };
//     }, [isAlanActive]);


//     return (
//         <div className='alan-btn-container p-0 m-0'>
//             {/* <div ref={rootElef}></div> */}
//         </div>
//     )
// }

// export default AlanAiContainer