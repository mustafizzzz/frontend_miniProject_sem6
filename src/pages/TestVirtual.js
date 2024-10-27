import React, { useState, useRef, useEffect } from 'react';

function TestVirtual() {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);
    const shouldListenRef = useRef(false); // Add this to track listening state

    const initializeRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Sorry, your browser doesn't support Web Speech API.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
            console.log("Started listening...");
            setListening(true);
        };

        recognitionRef.current.onresult = (event) => {
            const lastIndex = event.results.length - 1;
            const spokenText = event.results[lastIndex][0].transcript;
            setTranscript(prevTranscript => prevTranscript + "__" + spokenText);
            speakText(spokenText);
        };

        recognitionRef.current.onend = () => {
            console.log("Recognition ended");
            // Check shouldListenRef instead of listening state
            if (shouldListenRef.current) {
                console.log("Restarting recognition...");
                setTimeout(() => {
                    try {
                        recognitionRef.current.start();
                    } catch (error) {
                        console.error("Error restarting recognition:", error);
                        initializeRecognition();
                        recognitionRef.current.start();
                    }
                }, 2000); // Increased delay slightly
            } else {
                setListening(false);
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Recognition error:", event.error);
            if (event.error === 'not-allowed') {
                alert("Please allow microphone access to use this feature.");
                shouldListenRef.current = false;
                setListening(false);
            } else if (event.error === 'no-speech') {
                console.log("No speech detected, continuing...");
                if (shouldListenRef.current) {
                    recognitionRef.current.stop();
                }
            } else {
                if (shouldListenRef.current) {
                    recognitionRef.current.stop();
                }
            }
        };
    };

    useEffect(() => {
        initializeRecognition();
        return () => {
            shouldListenRef.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        setTranscript('');
        shouldListenRef.current = true;
        setListening(true);

        initializeRecognition();
        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error("Error starting recognition:", error);
        }
    };

    const stopListening = () => {
        shouldListenRef.current = false;
        setListening(false);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error("Error stopping recognition:", error);
            }
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            console.log("Speaking ended");
        };
        speechSynthesis.speak(utterance);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Voice Repeater</h2>
            <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                margin: '20px auto',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '80%',
                backgroundColor: '#f9f9f9'
            }}>
                {transcript.split('\n').map((line, index) => (
                    line && <p key={index} style={{ margin: '5px 0' }}>{line}</p>
                ))}
            </div>
            {!listening ? (
                <button
                    onClick={startListening}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background-color 0.3s'
                    }}
                >
                    Start Listening
                </button>
            ) : (
                <button
                    onClick={stopListening}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background-color 0.3s'
                    }}
                >
                    Stop Listening
                </button>
            )}
            {listening && (
                <p style={{ color: '#4CAF50', marginTop: '10px' }}>
                    Listening... Speak something!
                </p>
            )}
        </div>
    );
}

export default TestVirtual;