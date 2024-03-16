import { createContext, useState } from "react";

export const emotionsContext = createContext();

const EmotionsProvider = ({ children }) => {

    const [textEmotions, setTextEmotions] = useState(null);
    const [videoEmotions, setVideoEmotions] = useState(null);
    const [audioEmotions, setAudioEmotions] = useState(null);


    return (

        <emotionsContext.Provider value={{ textEmotions, setTextEmotions, videoEmotions, setVideoEmotions, audioEmotions, setAudioEmotions }}>
            {children}
        </emotionsContext.Provider>
    )
}

export default EmotionsProvider;