import React, { useState, useEffect, useRef } from 'react';

function TestVirtual() {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);
    const speakingRef = useRef(false); // To track if speaking is in progress

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Sorry, your browser doesn't support Web Speech API.");
            return;
        }

        // Initialize SpeechRecognition
        const SpeechRecognition = window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Listen for each sentence separately
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        // When listening starts
        recognitionRef.current.onstart = () => {
            console.log("Listening...");
        };

        // When listening result is received
        recognitionRef.current.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setTranscript(spokenText);
            speakText(spokenText); // Speak the recognized text
        };

        // When listening stops naturally or due to stop call
        recognitionRef.current.onend = () => {
            if (listening && !speakingRef.current) {
                setTimeout(() => startListening(), 500); // Restart listening after speaking
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Recognition error:", event.error);
        };

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [listening]);

    // Start listening function
    const startListening = () => {
        if (recognitionRef.current && !speakingRef.current) {
            recognitionRef.current.start();
        }
    };

    // Stop listening function
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    // Handle Start button
    const handleStart = () => {
        setListening(true);
        startListening();
    };

    // Handle Exit button
    const handleExit = () => {
        setListening(false);
        stopListening();
    };

    // Function to speak recognized text
    const speakText = (text) => {
        stopListening(); // Stop listening while speaking
        speakingRef.current = true;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            speakingRef.current = false;

            setTimeout(() => startListening(), 2000); // Restart listening after speaking

            console.log("Speaking ended");

        };
        speechSynthesis.speak(utterance);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Voice Repeater</h2>
            <p>{transcript}</p>
            {!listening ? (
                <button onClick={handleStart}>Start</button>
            ) : (
                <button onClick={handleExit}>Exit</button>
            )}
        </div>
    );
}

export default TestVirtual;
