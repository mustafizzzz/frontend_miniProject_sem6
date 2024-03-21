import React, { useContext, useEffect, useState } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlanContext } from '../../ContextApi/AlanContext';
import { set } from 'firebase/database';

const AlanAiContainer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    //context import
    const { loginUserNameAlan, setLoginUserNameAlan,
        handleOpenAlanCapture,
        loginStatusAlan,
        isAlanActive, setIsAlanActive,
        setLoginAlanType,
        setShowFormAlan, loginButtonRef } = useContext(AlanContext);
    console.log('Neme of user after call.....', loginUserNameAlan);
    console.log('button.....', loginButtonRef.current);

    useEffect(() => {
        window.alanBtnInstance = alanBtn({
            key: '8dbb5a96589bcce4042beb0a45c06e472e956eca572e1d8b807a3e2338fdd0dc/stage',
            onButtonState: async (status) => {

                // if (status === "ONLINE" && !window.welcomeMsgPlayed) {
                //     window.alanBtnInstance.activate();
                //     window.alanBtnInstance.playText('You are online now. You can give me commands for your login just say start login.');
                //     window.welcomeMsgPlayed = true;
                // }
            },

            onCommand: (commandData) => {
                if (commandData.command === 'start login') {
                    setLoginAlanType('student')
                    setShowFormAlan(true);
                    navigate('/login');
                }
                if (commandData.command === 'deactivate') {
                    console.warn('iam dataaaaa');

                    window.alanBtnInstance.deactivate();
                }
                if (commandData.command === 'getUsername') {
                    // console.log('iam dataaaaa', commandData.command.data.value);
                    const userNametoLower = commandData.data.value.toLowerCase();
                    setLoginUserNameAlan(userNametoLower);
                }
                if (commandData.command === 'captureLogin') {
                    handleOpenAlanCapture();

                    setTimeout(() => {
                        if (loginButtonRef.current) {
                            loginButtonRef.current.click();
                        }
                    }, 10000);



                }


                // if (commandData.command === 'loginStatus') {
                //     window.alanBtnInstance.callProjectApi("setLoginStatus", { loginStatus: loginStatusAlan }, function (error, result) { });
                // }
                console.log(commandData);
            }
        });
    }, []);

    //send the path to alan
    useEffect(() => {
        window.alanBtnInstance.setVisualState({ "path": location.pathname })
        console.log('%cAlan path', 'color:yellow', location.pathname);
    }, [location])



    //activate and deactivate alan
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.code === 'ArrowRight') {
                if (isAlanActive) {
                    setIsAlanActive(false);
                    window.alanBtnInstance.deactivate();
                } else {
                    setIsAlanActive(true);
                    window.alanBtnInstance.activate();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isAlanActive]);


    return (
        <div className='alan-btn-container p-0 m-0'>
            {/* <div ref={rootElef}></div> */}
        </div>
    )
}

export default AlanAiContainer