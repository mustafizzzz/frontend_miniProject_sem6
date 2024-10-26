import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Fab, Zoom } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StopIcon from '@mui/icons-material/Stop';

const VirtualAssistant = () => {

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [voices, setVoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [spokenCommand, setSpokenCommand] = useState("");

    const vpnText = "A VPN, or Virtual Private Network, is a service that encrypts your internet connection to secure it and protect your privacy online.";

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === '0') {
                event.preventDefault();
                setIsVisible((prev) => {
                    if (!prev) {
                        handleSpeak(vpnText);
                        startListening();
                    } else {
                        handleSpeak("Goodbye!");
                        stopListening(); // Stop listening
                    }
                    return !prev; // Toggle visibility
                });

            }
        };

        document.addEventListener('keydown', handleKeyPress);
        console.log('Virtual Assistant is ready!');

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            window.speechSynthesis.cancel();
            stopListening(); // Stop listening
        };
    }, []);

    const handleSpeak = async (text) => {

        window.speechSynthesis.cancel();
        if (isSpeaking) {
            setIsSpeaking(false);
            return;
        }

        try {
            const speech = new SpeechSynthesisUtterance(text);
            speech.onend = () => {
                setIsSpeaking(false);
                window.speechSynthesis.cancel(); // Ensure cleanup after speaking
            };

            speech.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                setIsSpeaking(false);
                window.speechSynthesis.cancel();
            };

            // console.log(window.speechSynthesis.speak(speech));

            window.speechSynthesis.speak(speech);
            setIsSpeaking(true);


        } catch (error) {
            console.error('Speech synthesis failed:', error);
            setIsSpeaking(false);
        }
    };

    // Speech Recognition for capturing commands
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Enable continuous listening
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        setSpokenCommand(transcript);
        console.log("Command:", transcript);

        // Perform actions based on command
        if (transcript.toLowerCase() === 'exit') {
            handleSpeak("Goodbye!"); // Provide feedback on exit
            stopListening(); // Stop listening when "exit" is detected
            setIsVisible(false);
        } else if (transcript.toLowerCase().includes('navigate home')) {
            console.log('Navigating to Home...');
            // Add navigation logic here
        }
        // Restart listening for further commands
        // recognition.start();
    };

    recognition.onerror = (event) => {
        console.error('Recognition error:', event);
        recognition.start(); // Restart listening on error
    };

    const startListening = () => {
        recognition.start();
    };

    const stopListening = () => {
        recognition.stop();
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
                        color={isSpeaking ? "secondary" : "primary"}
                        onClick={() => {
                            handleSpeak('Goodbye , have a nice day!');
                            stopListening();
                            setIsVisible(false)
                        }}
                        sx={{
                            boxShadow: 3,
                            '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'transform 0.2s ease-in-out',
                            },
                            animation: isSpeaking ? 'pulse 1.5s ease-in-out infinite' : 'none',
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
                            <StopIcon sx={{ fontSize: 24 }} />
                        ) : (
                            <SmartToyIcon sx={{ fontSize: 24 }} />
                        )}
                    </Fab>
                </Box>
            </Zoom>

        )
    )
};

export default VirtualAssistant;