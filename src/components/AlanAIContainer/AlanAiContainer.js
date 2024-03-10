import React, { useEffect } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web';
import { useLocation } from 'react-router-dom';

const AlanAiContainer = () => {
    const location = useLocation();
    useEffect(() => {
        window.alanBtnInstance = alanBtn({
            key: 'bbcf90b2a7afac791638d0fe654eafe92e956eca572e1d8b807a3e2338fdd0dc/stage',
            onButtonState: async (status) => {

                if (status === "ONLINE" && !window.welcomeMsgPlayed) {
                    window.alanBtnInstance.activate();
                    window.alanBtnInstance.playText('Hello, I am your voice virtual assistant. You can give me commands for your login and registrations.');
                    window.welcomeMsgPlayed = true;
                }
            },
            onCommand: (commandData) => {
                console.log(commandData);
            }
        });
    }, []);

    useEffect(() => {
        window.alanBtnInstance.setVisualState({ "path": location.pathname })
        console.log(location.pathname);
    }, [location])


    return (
        <div className='alan-btn-container p-0 m-0'>
            {/* <div ref={rootElef}></div> */}
        </div>
    )
}

export default AlanAiContainer