import React, { useContext, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, Repeat } from 'lucide-react';
import './OralSocketPage.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { io } from 'socket.io-client';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firbaseConfig';
import { UserContext } from '../../ContextApi/userContex';

// let socket = io('wss://mood-lens-server.onrender.com',
// 	{
// 		reconnectionAttempts: 5,
// 		timeout: 10000,
// 	});


const DEFAULT_TEST_ID = '67fba40656122a4e9558cc69';

let socket = io('http://localhost:5000', {
	reconnectionAttempts: 2,
	timeout: 5000
});

const OralSocketPage = () => {
	const { testId } = useParams();
	const location = useLocation();
	const { currentUser } = useContext(UserContext);


	const [isAISpeaking, setIsAISpeaking] = useState(true);
	const [question, setQuestion] = useState([]);
	const [answer, setAnswer] = useState('');
	const test_id = testId || DEFAULT_TEST_ID;
	const audioRef = useRef(new Audio());
	const [selectedVoice, setSelectedVoice] = useState('');
	const [availableVoices, setAvailableVoices] = useState([]);
	const [isVoiceSelected, setIsVoiceSelected] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// React speech recognition
	const [isListening, setIsListening] = useState(false);
	const { transcript, listening, resetTranscript } = useSpeechRecognition();


	//test data states
	const [remainingTime, setRemainingTime] = useState(null); // Timer in seconds
	const [testData, setTestData] = useState(null);
	const [isEnding, setIsEnding] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [evaluationData, setEvaluationData] = useState(null);
	const [backDropMessage, setBackDropMessage] = useState("Loding test please wait...")
	const navigate = useNavigate();

	//video record data
	const videoRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const recordedChunksRef = useRef([]);

	//get the test data using testid
	useEffect(() => {
		const fetchTestDetails = async () => {
			try {
				const res = await axios.get(`https://mood-lens-server.onrender.com/api/v1/api/tests/${testId}`);
				setTestData(res.data);
				setRemainingTime(res.data.duration * 60); // assume duration in minutes
			} catch (err) {
				console.error("Failed to fetch test data:", err);
			}
		};

		fetchTestDetails();
	}, [testId]);

	//set the timer
	useEffect(() => {
		if (!remainingTime || remainingTime <= 0) return;

		const interval = setInterval(() => {
			setRemainingTime((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [remainingTime]);

	// Load default system voices
	useEffect(() => {
		if ('speechSynthesis' in window) {
			const voices = window.speechSynthesis.getVoices();

			// If voices are not immediately available, wait for the voiceschanged event
			if (voices.length === 0) {
				window.speechSynthesis.onvoiceschanged = () => {
					const updatedVoices = window.speechSynthesis.getVoices();
					setAvailableVoices(updatedVoices);

					// Optionally set a default voice
					const defaultVoice = updatedVoices.find(voice =>
						voice.lang.startsWith('en-') && voice.name.toLowerCase().includes('female')
					) || updatedVoices[0];

					if (defaultVoice) {
						setSelectedVoice(defaultVoice.name);
					}
				};
			} else {
				setAvailableVoices(voices);

				// Set default voice
				const defaultVoice = voices.find(voice =>
					voice.lang.startsWith('en-') && voice.name.toLowerCase().includes('female')
				) || voices[0];

				if (defaultVoice) {
					setSelectedVoice(defaultVoice.name);
				}
			}

		}
	}, []);

	// Access webcam on component mount
	// useEffect(() => {
	// 	const startVideo = async () => {
	// 		try {
	// 			const stream = await navigator.mediaDevices.getUserMedia({
	// 				video: true,
	// 				audio: true
	// 			});

	// 			if (videoRef.current) {
	// 				videoRef.current.srcObject = stream;
	// 			}
	// 		} catch (err) {
	// 			console.error("Error accessing webcam:", err);
	// 		}
	// 	};

	// 	startVideo();

	// 	// Cleanup function to stop all tracks when component unmounts
	// 	return () => {
	// 		if (videoRef.current && videoRef.current.srcObject) {
	// 			const tracks = videoRef.current.srcObject.getTracks();
	// 			tracks.forEach(track => track.stop());
	// 		}
	// 	};
	// }, []);

	useEffect(() => {
		const startVideoAndRecording = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}

				const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

				mediaRecorder.ondataavailable = (e) => {
					if (e.data.size > 0) {
						recordedChunksRef.current.push(e.data);
					}
				};

				mediaRecorder.start(); // start recording
				mediaRecorderRef.current = mediaRecorder;
			} catch (err) {
				console.error("Error accessing webcam/mic:", err);
			}
		};

		startVideoAndRecording();

		// Cleanup: stop tracks & recording
		return () => {
			if (mediaRecorderRef.current?.state !== "inactive") {
				mediaRecorderRef.current.stop();
			}

			if (videoRef.current?.srcObject) {
				videoRef.current.srcObject.getTracks().forEach(track => track.stop());
			}
		};
	}, []);


	// Socket connection
	useEffect(() => {
		console.log('Run socket');

		if (location.pathname.startsWith("/test-socket")) {
			console.log("Start Audio with test id: ", test_id);

			socket.emit('start_test', { test_id });
			socket.on('questions', (data) => {
				handleTextToSpeech(data);
				setQuestion((prevMessages) => [...prevMessages, { type: 'question', text: data }]);

				socket.emit('question_ack', { message: 'Question received' });
				socket.emit('ready_for_next', { message: 'Ready for next question' });
			});

			socket.on('response', (response) => {
				setQuestion((prevMessages) => [...prevMessages, { type: 'question', text: response }]);
				handleTextToSpeech(response);
			});

			socket.on('error', (errorMessage) => {
				alert(`Error: ${errorMessage}`);
			});
		}

		return () => {
			socket.off('questions');
			socket.off('response');
			socket.off('error');
		};
	}, [location.pathname, testId]);

	// Update answer with transcript
	useEffect(() => {
		if (listening) {
			setAnswer(transcript);
		}
	}, [transcript, listening]);

	//format the time
	const formatTime = (timeInSec) => {
		const minutes = Math.floor(timeInSec / 60).toString().padStart(2, '0');
		const seconds = (timeInSec % 60).toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	};

	// Handle voice selection
	const handleVoiceChange = (event) => {
		const voiceName = event.target.value;
		setSelectedVoice(voiceName);
	};

	// Text to speech using browser's speech synthesis
	const handleTextToSpeech = (text = "Default text") => {
		console.log("Speaking:", text);

		// Cancel any ongoing speech
		window.speechSynthesis.cancel();

		// Create speech utterance
		const utterance = new SpeechSynthesisUtterance(text);

		// Select the chosen voice
		if (selectedVoice) {
			const voices = window.speechSynthesis.getVoices();
			const voice = voices.find(v => v.name === selectedVoice);
			if (voice) {
				utterance.voice = voice;
			}
		}

		// Configure speech properties
		utterance.pitch = 1;
		utterance.rate = 0.9;
		utterance.volume = 1;

		// Set speaking state and speak
		setIsAISpeaking(true);
		window.speechSynthesis.speak(utterance);
	};

	// Submit answer handler
	const handleAnswerSubmit = async () => {
		if (answer.trim() !== '') {
			setIsSubmitted(true);
			setQuestion((prevMessages) => [
				...prevMessages,
				{ type: 'answer', text: answer }
			]);
			socket.emit('message', { message: answer });
			resetTranscript();
			setIsListening(false);

			await new Promise(resolve => setTimeout(resolve, 4000));
			setIsSubmitted(false);
			setAnswer('');
		} else {
			alert('Please enter an answer before submitting.');
		}
	};

	// Microphone toggle handler
	const handleMicClick = () => {
		if (isListening) {
			SpeechRecognition.stopListening();
			setIsListening(false);
		} else {
			SpeechRecognition.startListening({ continuous: true });
			setIsListening(true);
			setIsAISpeaking(false);
		}
	};

	//end test
	const uploadSingleVideoToFirebase = async (storage, testId, studentName) => {
		if (recordedChunksRef.current.length === 0) {
			console.warn("No video recorded.");
			return null;
		}

		const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
		const fileName = `AssessmentVideoProctor/${testId}/${studentName}_${Date.now()}.webm`;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, blob);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setBackDropMessage(`Uploading video... ${progress.toFixed(2)}%`)
					console.log(`Upload is ${progress}% done`);
				},
				(error) => {
					setBackDropMessage("Upload failed, please try again.")
					console.error("Upload failed:", error);
					reject(error);
				},
				async () => {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
					console.log("Uploaded video URL:", downloadURL);
					recordedChunksRef.current = []; // clear after upload
					resolve(downloadURL);
				}
			);
		});
	};

	const handleEndExam = async () => {
		setIsEnding(true);
		setBackDropMessage("Ending exam, please wait...")

		try {
			// Stop recording before upload
			if (mediaRecorderRef.current?.state !== "inactive") {
				mediaRecorderRef.current.stop();
			}

			// Wait a bit for the last chunk
			setTimeout(async () => {
				const videoUrl = await uploadSingleVideoToFirebase(storage, testId, currentUser.name);
				setBackDropMessage("Evaluating your test,please wait...");

				socket.emit("end_test", {
					test_id: testId,
					student_id: currentUser.hostId,
					videoUrl,
				});
			}, 4000);
			socket.on('evaluation', (data) => {
				setEvaluationData(data);
				setDialogOpen(true);
				setIsEnding(false);
			});
		} catch (err) {
			console.error("Error ending exam:", err);
			setIsEnding(false);
		}
	};


	return (

		<div className="min-vh-100 bg-light p-4">
			<div className="container">

				<div className="card mx-auto main-container">
					{/* Header */}
					<div className="card-header bg-primary text-white d-flex justify-content-between">
						<h1 className="h5 mb-0">AI Oral Examination</h1>
						<div className="voice-selector" style={{ width: '200px' }}>
							<select
								className="form-select form-select-sm"
								onChange={handleVoiceChange}
								value={selectedVoice}
								disabled={isVoiceSelected}
							>
								<option value="">Select AI Voice</option>
								{availableVoices.map((voice) => (
									<option key={voice.name} value={voice.name}>
										{voice.name} ({voice.lang})
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Main Content */}
					<div className="card-body">

						{/* Video/Avatar Section */}
						<div className="row mb-4">
							{/* AI Avatar */}
							<div className="col-md-6 text-center">
								<div className={`avatar-container mx-auto mb-3 ${isAISpeaking ? 'ai-speaking' : ''}`}>
									<img
										// src="https://via.placeholder.com/600"
										src="/AALE_face.png"
										alt="AI Avatar"
										className="img-fluid rounded ai-female"

									/>
								</div>
								{/* AI Speech Text */}
								<div className="position-relative">
									<button
										className="btn btn-light repeat-btn shadow-sm"
										onClick={() => setIsAISpeaking(true)}
									>
										<Repeat size={16} onClick={() => {
											handleTextToSpeech(question[question.length - 1]?.text);
										}} />

									</button>

									<div className="speech-box border bg-light p-3 rounded">
										<p className="mb-0 fw-bold">
											{question.length > 0 && question[question.length - 1].type === 'question' ? question[question.length - 1].text : "Waiting for the next question..."}
										</p>
									</div>
								</div>
							</div>

							{/* Student Video */}
							<div className="col-md-6 text-center">
								<div className={`video-container mx-auto mb-3 ${isListening ? 'student-speaking' : ''}`}>
									<video
										ref={videoRef}
										autoPlay
										playsInline
										muted // Muted to prevent feedback, remove if you want to hear audio
										className="w-100 h-100 bg-dark rounded"
										style={{ objectFit: 'cover' }}
									/>
								</div>
								{isSubmitted && (
									<div className="answer-box border bg-primary p-3 rounded">
										<p className="mb-0 fw-bold text-white">
											{answer.trim() !== '' ? answer : "your answer here..."}
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Answer Section */}
						<div className="border-top pt-4">

							<div className="mb-3">
								<textarea
									value={answer}
									className="form-control"
									placeholder="Type your answer here..."
									rows="3"
									onChange={(e) => setAnswer(e.target.value)}
									disabled={isListening}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleAnswerSubmit();
										}
									}}
								/>
							</div>

							{/* Controls */}
							<div className="d-flex justify-content-between align-items-center">

								<div className="d-flex gap-3">
									<button
										className={`btn border btn-icon-oral ${isListening ? 'btn-danger' : 'btn-secondary'}`}
										onClick={() => {
											handleMicClick();
											setIsListening(!isListening);
											setIsAISpeaking(false);
										}}
									>
										{isListening ? <Mic size={20} /> : <MicOff size={20} />}
									</button>
									<button className="btn btn-primary d-flex align-items-center gap-2"
										onClick={handleAnswerSubmit}>
										<Send size={20} />
										Submit Answer
									</button>
								</div>

								<div className="d-flex gap-3">
									<button className="btn btn-secondary"
										onClick={handleAnswerSubmit}>
										Next Question
									</button>
									<button className="btn btn-danger"
										onClick={handleEndExam}>
										End Exam
									</button>
								</div>
							</div>

						</div>
					</div>

				</div>


				{/* BackDrop */}
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
					open={isEnding}
				>
					<CircularProgress color="inherit" />
					<p className='m-0 p-0 fs-4 mx-2'>{backDropMessage}</p>
				</Backdrop>

				{/* Dialog for test result */}
				<Dialog open={dialogOpen} onClose={() => { }} fullWidth maxWidth="sm">
					<DialogTitle>Test Evaluation</DialogTitle>
					<DialogContent>
						<p><strong>Feedback:</strong> {evaluationData?.feedback}</p>
						<p><strong>Summary:</strong> {evaluationData?.summary}</p>
						<p><strong>Marks:</strong> {evaluationData?.marks}</p>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => navigate('/dashboard')} color="primary">Close</Button>
					</DialogActions>
				</Dialog>

			</div>
		</div>

	);
};

export default OralSocketPage;