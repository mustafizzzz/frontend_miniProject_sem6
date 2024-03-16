import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TestPage = () => {
    const [text, setText] = useState('');
    const { transcript, resetTranscript } = useSpeechRecognition();

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        setText(transcript); // Store transcript in state
        resetTranscript(); // Clear transcript when stopped
    };

    return (
        <div>
            <button onClick={startListening}>Start Listening</button>
            <button onClick={stopListening}>Stop Listening</button>
            <p>Transcript: {transcript}</p>
        </div>
    );
};

export default TestPage;
