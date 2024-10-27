import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { Fab, Zoom } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StopIcon from '@mui/icons-material/Stop';

const VirtualAssistant = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const shouldListenRef = useRef(false);

    const initializeRecognition = () => {

        if (!('webkitSpeechRecognition' in window)) {
            alert("Sorry, your browser doesn't support Web Speech API.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
            console.log("Started listening...");
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
            const lastIndex = event.results.length - 1;
            const spokenText = event.results[lastIndex][0].transcript;
            console.log("Spoken text:", spokenText);

            handleSpeak(spokenText);
        };

        recognitionRef.current.onend = () => {
            console.log("Recognition ended");
            // Check shouldListenRef instead of listening state
            if (shouldListenRef.current) {
                console.log("Restarting recognition...");
                setTimeout(() => {
                    try {
                        console.log("Successfully restarted");

                        recognitionRef.current.start();
                    } catch (error) {
                        console.error("Error restarting recognition:", error);
                        initializeRecognition();
                        recognitionRef.current.start();
                    }
                }, 2000); // Increased delay slightly
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Recognition error:", event.error);
            if (event.error === 'not-allowed') {
                alert("Please allow microphone access to use this feature.");
                shouldListenRef.current = false;
                setIsListening(false);
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

    useEffect(() => {

        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === '0') {
                event.preventDefault();
                handleToggleAssistant();
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            stopListening();
        }
    }, [])




    const handleToggleAssistant = () => {
        if (!isVisible) {
            setIsVisible(true);
            handleSpeak("Hello Mustafiz");
            startListening();
        } else {
            handleExit();
        }
    };

    const handleSpeak = (text) => {

        window.speechSynthesis.cancel();
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
            console.log("Finished speaking");

            setIsSpeaking(false);

        };

        utterance.onerror = () => {
            setIsSpeaking(false);

        };

        window.speechSynthesis.speak(utterance);

    };

    const startListening = () => {
        shouldListenRef.current = true;
        setIsListening(true);
        initializeRecognition();
        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error("Error starting recognition:", error);
        }
    };

    const stopListening = () => {
        shouldListenRef.current = false;
        setIsListening(false);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error("Error stopping recognition:", error);
            }
        }
    };

    const handleExit = () => {
        stopListening();
        handleSpeak("Thank you Mustafiz");
        setIsVisible(false);
    };


    return (
        isVisible && (
            <Zoom in={isVisible} timeout={500}>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Fab
                        color={isSpeaking ? "primary" : "secondary"}
                        onClick={handleExit}
                        sx={{
                            boxShadow: 3,
                            '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'transform 0.2s ease-in-out',
                            },
                            animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
                            '@keyframes pulse': {
                                '0%': {
                                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
                                },
                                '70%': {
                                    boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                                },
                                '100%': {
                                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                                },
                            },
                        }}
                    >
                        {isSpeaking ? (
                            <SmartToyIcon sx={{ fontSize: 24 }} />

                        ) : (
                            <StopIcon sx={{ fontSize: 24 }} />
                        )}
                    </Fab>
                </Box>
            </Zoom>
        )
    );
};

export default VirtualAssistant;