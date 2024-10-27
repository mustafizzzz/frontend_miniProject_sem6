import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import Box from '@mui/material/Box';
import { Fab, Zoom } from '@mui/material';
import Face2Icon from '@mui/icons-material/Face2';
import StopIcon from '@mui/icons-material/Stop';
import { set } from 'firebase/database';
import { virtualContext } from '../../ContextApi/virtualContex';
import { useNavigate } from 'react-router-dom';

const soundOpen = new Audio('/open_sound_1.mp3');
const soundListen = new Audio('/listen_sound_1.mp3');
const soundClose = new Audio('/close_sound_1.mp3');

const VirtualAssistant = () => {
	const { loginVirtualType, setLoginVirtualType,
		virtualShowForm, setVirtualShowForm,
		studentVirtualName, setStudentVirtualName,
		openImageCapture, setOpenImageCapture,
		captureStatus, setCaptureStatus, loginButtonRef
	} = useContext(virtualContext);
	const [validator, setValidator] = useState(false);
	const navigate = useNavigate();
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [listening, setListening] = useState(false);
	const recognitionRef = useRef(null);
	const stopListeningTimeoutRef = useRef(null);
	const previousCaptureStatusRef = useRef(captureStatus);
	let username;

	useEffect(() => {

		// Initialize SpeechRecognition
		if ('webkitSpeechRecognition' in window) {
			recognitionRef.current = new window.webkitSpeechRecognition();
			recognitionRef.current.continuous = true;
			recognitionRef.current.interimResults = false;
			recognitionRef.current.lang = 'en-US';

			recognitionRef.current.onresult = (event) => {
				let current = event.resultIndex;
				let spokenText = event.results[current][0].transcript;
				spokenText = spokenText.toLowerCase().trim();
				console.log("Captured text:", spokenText);

				//========commands for virtual assistant=========
				// switch (true) {
				// 	case spokenText.includes('start login'):
				// 		setLoginVirtualType('student');
				// 		setVirtualShowForm(true);
				// 		navigate('/login');
				// 		handleSpeak('Redirecting to login page. Please provide your name.');
				// 		break;

				// 	case spokenText.includes('start register'):
				// 		navigate('/register');
				// 		handleSpeak('Redirecting to register page');
				// 		break;

				// 	case spokenText.includes('my name is'):
				// 		username = spokenText.replace('my name is', '').trim();
				// 		handleSpeak(`Your username is ${username} please verify`);
				// 		setValidator(true);
				// 		break;

				// 	case spokenText.includes('yes') && validator:
				// 		setStudentVirtualName('user12');
				// 		handleSpeak('Please be in frame for image verification');
				// 		setOpenImageCapture(true);
				// 		break;

				// 	case spokenText.split(' ').includes('no') && validator:
				// 		handleSpeak('Okay, please say your username again.');
				// 		setValidator(false); // Reset to not expecting password
				// 		break;

				// 	default:
				// 		handleSpeak('Sorry, I did not understand that');
				// }
				// handleSpeak(spokenText); // Speak the captured text
				handleCommand(spokenText);
			};

			recognitionRef.current.onend = () => {


				console.log("Speech recognition ended.");

			}

			recognitionRef.current.onerror = (event) => {
				console.error("Speech recognition error:", event.error);
				stopListening(); // Stop listening if there's an error
			};
		} else {
			alert("Sorry, your browser does not support the Web Speech API.");
		}
	}, []);

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.ctrlKey && event.key === '0') {
				event.preventDefault();
				handleToggleAssistant();
			} if (event.ctrlKey && event.key === 'ArrowRight') {
				event.preventDefault();

				stopListening();
				startListening();

			}
		};
		document.addEventListener('keydown', handleKeyPress);
		return () => {
			recognitionRef.current = null;
			document.removeEventListener('keydown', handleKeyPress);
			stopListening();
		};
	}, []);

	// Command handler function
	const handleCommand = (spokenText) => {
		if (spokenText.includes('start login')) {
			setLoginVirtualType('student');
			setVirtualShowForm(true);
			navigate('/login');
			handleSpeak('Redirecting to login page. Please provide your name.');
		} else if (spokenText.includes('start register')) {
			navigate('/register');
			handleSpeak('Redirecting to register page');
		} else if (spokenText.includes('my name is')) {
			username = spokenText.replace('my name is', '').trim();
			handleSpeak(`Your username is ${username}. Please verify.`);
			setValidator(true);
		} else if (spokenText.includes('yes correct')) {
			setStudentVirtualName(username);
			handleSpeak('Please be in frame for image verification');
			setOpenImageCapture(true);
			setTimeout(() => {
				if (captureStatus) {
					handleSpeak('Face ID successfully Captured. Wait for few Second');
					loginButtonRef.current.click();
				} else {
					handleSpeak('Face ID Capturing failed. Please try again.');
					setCaptureStatus(true);
				}
			}, 10000);
		} else if (spokenText.includes('no')) {
			handleSpeak('Okay, please say your username again.');
			setValidator(false); // Reset validator
		} else {
			handleSpeak('Sorry, I did not understand that');
		}
	};

	const handleToggleAssistant = () => {
		setIsVisible((prevVisible) => {
			if (!prevVisible) {
				soundOpen.play();
				soundOpen.addEventListener('ended', startListening);
			} else {
				soundClose.play();
				handleExit();
			}
			return !prevVisible;
		});
	};

	const handleSpeak = (text) => {
		console.log("Speaking:", text);

		window.speechSynthesis.cancel();
		setIsSpeaking(true);
		stopListening(); // Ensure it’s not listening while speaking

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.pitch = 1;
		utterance.rate = 0.9;
		utterance.volume = 1;

		utterance.onend = () => {
			setIsSpeaking(false);
			startListening(); // Resume listening after speaking
		};

		utterance.onerror = () => {
			setIsSpeaking(false);
			startListening();
		};

		window.speechSynthesis.speak(utterance);
	};

	const startListening = () => {

		if (recognitionRef.current && !isSpeaking) {

			try {
				// First stop any existing recognition
				if (listening) {
					recognitionRef.current.stop();
					clearTimeout(stopListeningTimeoutRef.current);
				}
				console.log("Listening for 6 seconds...");
				setListening(true);
				soundListen.play();
				recognitionRef.current.start();

				// Stop listening after 6 seconds, ensuring strict timing
				stopListeningTimeoutRef.current = setTimeout(() => {
					recognitionRef.current.stop();
					console.log("Speech recognition stopped after 6 seconds.");
					setListening(false);
				}, 8000);
			} catch (error) {
				console.error("Error starting speech recognition:", error);
				stopListening();

			}
		}
	};

	const stopListening = () => {
		try {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		} catch (error) {
			console.error("Error stopping speech recognition:", error);
		}
		clearTimeout(stopListeningTimeoutRef.current);
		setListening(false);
	};

	const handleExit = () => {
		stopListening();
		setIsVisible(false);
	};

	// New effect to handle image capture status changes
	useEffect(() => {
		if (captureStatus !== previousCaptureStatusRef.current && openImageCapture) {
			if (captureStatus === true) {
				handleSpeak('Face ID successfully matched. You can proceed.');
			} else if (captureStatus === false) {
				handleSpeak('Face ID verification failed. Please try again.');
			}
			previousCaptureStatusRef.current = captureStatus;
		}
	}, [captureStatus, openImageCapture]);

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
						onClick={startListening}
						sx={{
							boxShadow: 3,
							'&:hover': {
								transform: 'scale(1.1)',
								transition: 'transform 0.2s ease-in-out',
							},
							animation: listening ? 'pulse 1.5s ease-in-out infinite' : 'none',
							'@keyframes pulse': {
								'0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
								'70%': { boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)' },
								'100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' },
							},
						}}
					>
						{isSpeaking ?
							<Face2Icon sx={{ fontSize: 24 }} /> :
							<StopIcon sx={{ fontSize: 24 }} />
						}
					</Fab>
				</Box>
			</Zoom>
		)
	);
};

export default VirtualAssistant;
