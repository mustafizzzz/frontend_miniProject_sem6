import { createContext, useState } from "react";

export const emotionsContext = createContext();

const EmotionsProvider = ({ children }) => {

    const [textEmotions, setTextEmotions] = useState(null);
    const [videoEmotions, setVideoEmotions] = useState(null);
    const [audioEmotions, setAudioEmotions] = useState(null);
    const [overAllEmotions, setOverAllEmotions] = useState(null);


    return (

        <emotionsContext.Provider value={{ textEmotions, setTextEmotions, videoEmotions, setVideoEmotions, audioEmotions, setAudioEmotions, overAllEmotions, setOverAllEmotions }}>
            {children}
        </emotionsContext.Provider>
    )
}

export default EmotionsProvider;