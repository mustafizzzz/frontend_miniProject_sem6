import React, { useContext, useEffect, useState } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlanContext } from '../../ContextApi/AlanContext';
import { set } from 'firebase/database';

const AlanAiContainer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAlanActive, setIsAlanActive] = useState(false);

    //context import
    const { loginUserName, setLoginUserName, handleOpen,
        handleClose } = useContext(AlanContext);
    console.log('context.....', loginUserName);

    useEffect(() => {
        window.alanBtnInstance = alanBtn({
            key: '604046f361fd8463cd587654400759792e956eca572e1d8b807a3e2338fdd0dc/stage',
            onButtonState: async (status) => {

                // if (status === "ONLINE" && !window.welcomeMsgPlayed) {
                //     window.alanBtnInstance.activate();
                //     window.alanBtnInstance.playText('You are online now. You can give me commands for your login just say start login.');
                //     window.welcomeMsgPlayed = true;
                // }
            },
            onCommand: (commandData) => {
                if (commandData.command === 'start login') {
                    navigate('/login');
                }
                if (commandData.command === 'deactivate') {
                    console.warn('iam dataaaaa');

                    window.alanBtnInstance.deactivate();
                }
                if (commandData.command === 'getUsername') {

                    setLoginUserName(commandData.data.value);
                }
                if (commandData.command === 'captureLogin') {
                    handleOpen();
                }
                console.log(commandData);
            }
        });
    }, []);

    useEffect(() => {
        window.alanBtnInstance.setVisualState({ "path": location.pathname })
        console.log(location.pathname);
    }, [location])

    useEffect(() => {
        const handleKeyPress = (event) => {
            console.log('pressssssssssssssssssss');
            if (event.code === 'Space') {
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