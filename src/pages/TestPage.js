import React, { useState, useEffect } from 'react';

const TestPage = () => {
    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.log('Speech recognition is not supported by this browser.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            console.log('Listening...');
        };

        recognition.onend = () => {
            setIsListening(false);
            console.log('Stopped listening.');
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('');

            setRecognizedText(transcript);
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening]);

    useEffect(() => {
        if (!isListening) {
            console.log('Saved text:', recognizedText);
        }
    }, [isListening, recognizedText]);

    const toggleListening = () => {
        setIsListening((prevState) => !prevState);
    };

    return (
        <div>
            <button onClick={toggleListening}>
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            <p>Recognized Text: {recognizedText}</p>
        </div>
    );
};

export default TestPage;
