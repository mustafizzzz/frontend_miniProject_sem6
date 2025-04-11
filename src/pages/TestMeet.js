import { useRef, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import '.././components/Room.css'
import ReactMarkdown from 'react-markdown';



//firebase Imports for recording
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContext } from '../ContextApi/userContex';
import { captureImage, emotionDetect, getCurrentTimeTeacher, textEmotion, videoNotesUploadEndMeet } from '../RoomFunction/roomApiCalls';
import { startListening, stopListening } from '../RoomFunction/audioRecorder';
import { deleteStudentImage } from '../RoomFunction/deleteStudentImage';
import ChrisViewAnalytics from '../components/ChrisViewAnalytics/ChrisViewAnalytics';
import { storage } from '../firbaseConfig';
import { emotionsContext } from '../ContextApi/emotionsContext';
import { handleMakingNotes, printFormattedNotes, startRecording, stopRecording, uploadVideosToFirebase } from '../RoomFunction/videoRecorder';
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';



const queryClient = new QueryClient();


const TestMeet = () => {

	const { roomId } = useParams();
	const [imageData, setImageData] = useState([]);
	const [isCapturing, setIsCapturing] = useState(false);
	const { currentUser } = useContext(UserContext);
	const { setTextEmotions, setVideoEmotions, setAudioEmotions, setOverAllEmotions, setStudentLiveEmotions } = useContext(emotionsContext);
	const [isProcessing, setIsProcessing] = useState(false); // To handle loading state
	const [displayHelperButton, setDisplayHelperButton] = useState(false);

	//==================testing tanstack query start====================
	const { data } = useQuery({
		queryKey: ['continuousProcess', roomId, currentUser.role],
		queryFn: async () => {
			if (currentUser.role === 'teacher') {

				await emotionDetect(currentUser, roomId,
					setTextEmotions, setVideoEmotions, setAudioEmotions,
					setOverAllEmotions, setStudentLiveEmotions);

				return { status: 'emotionDetect completed' };
			} else if (currentUser.role === 'student') {
				await captureImage(currentUser, roomId,
					setImageData, isCapturing);
				return { status: 'captureImage completed' };
			}
			return { status: 'no action taken' }; // Handle the case where neither role matches
		},
		refetchInterval: currentUser.role === 'teacher' ? 10000 : 5000, // Interval based on role
		refetchIntervalInBackground: true,
		enabled: isProcessing, // Only run when processing is active
		onSuccess: () => {
			console.log('Process completed successfully.');
		},
		onError: (error) => {
			console.error('Process failed:', error);
		},
		onSettled: () => {
			console.log('Query has settled (either succeeded or failed).');
		},
	});
	//==================testing tanstack query end====================

	//<===================audio emotion start===================>
	const [isListening, setIsListening] = useState(true);
	const [audioList, setAudioList] = useState([]);
	const mediaAudioRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const mediaStreamRef = useRef(null);

	//audio button click event

	useEffect(() => {

		const handleClick = (event) => {

			if (currentUser.role === 'teacher') return; // Only for students

			if (event.target.classList.contains('QYvze2FiFrLlotTk5Iz7' || 'h2M8QwerO1XmsfrZlpv6')) {
				console.log('Clicked on the audio button');
				setIsListening(prevIsListening => !prevIsListening);
				console.log('Audio listening:', isListening);
				if (isListening) {
					startListening(mediaAudioRecorderRef, audioChunksRef, mediaStreamRef, setAudioList, roomId, currentUser);
				} else {
					stopListening(mediaAudioRecorderRef, mediaStreamRef);
				}
			}

		};

		// Add event listener to document for click events
		document.addEventListener('click', handleClick);

		// Cleanup function to remove event listener when component unmounts
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, [isListening]);

	console.log('Audio list:', audioList);

	//<===================audio emotion end===================>

	//<===================Video recording code test===============================>
	const [isRecording, setIsRecording] = useState(false);
	const [isMakingNotes, setIsMakingNotes] = useState(false);
	const [videoUrls, setVideoUrls] = useState([]);
	const [notes, setNotes] = useState("");

	const mediaRecorderRef = useRef(null);
	const screenStreamRef = useRef(null);
	const recordedVideos = useRef([]);
	const markdownRef = useRef(null);

	const [openNotesDialogBox, setOpenNotesDialogBox] = useState(false);

	useEffect(() => {
		if (notes) {
			setOpenNotesDialogBox(true); // Automatically show dialog when notes are available
		}
	}, [notes]);

	// Handle switch toggle
	const handleSwitchChange = () => {
		if (!isRecording) {
			startRecording(setIsRecording, mediaRecorderRef, screenStreamRef, recordedVideos);
		} else {
			stopRecording(setIsRecording, mediaRecorderRef, screenStreamRef);
		}
	};

	//it will uploade the vide and make notes
	const endMeetingMakeNotes = async () => {

		if (currentUser.role === 'student') {
			window.location.href = '/dashboard/home';
			return;
		}

		try {
			setIsMakingNotes(true);
			console.log("Ending meeting and uploading videos and making notes...");
			const urls = await uploadVideosToFirebase(recordedVideos, storage, roomId, setVideoUrls);
			if (urls.length > 0) {
				await handleMakingNotes(urls, roomId, setNotes);
			} else {
				alert("No url found");

			}
		} catch (error) {
			console.log("Error in making notes:", error);
			setIsMakingNotes(false);
		} finally {
			setIsMakingNotes(false);
		}
	};

	//Note:when click on end meet all video uploade by a function 


	// <===================Video recording code test end==============================>

	//<====================End meeting from db api call====================>

	const endMeetingCall = async () => {

		try {
			const response = await axios.post('https://mood-lens-server.onrender.com/api/v1/meeting/end_meeting', {
				meet_id: parseInt(roomId) || '123',
				endTime: getCurrentTimeTeacher(),
			});
			console.log('Response from end meeting API:', response);



		} catch (error) {
			console.error('Error in ending meeting:', error);
		}
	}

	//===================Meeting UI Code===========================================>
	const meetingUI = async (element) => {
		const appID = 1703483768;
		const serverSecret = '07a7144d947c0f58c0d6284fc7c0bd8b';
		const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
			appID,
			serverSecret,
			roomId || '123',
			uuidv4(),
			`${currentUser.userName || "Your Name"}`
		);
		if (!appID || !serverSecret) {
			alert('Zego app ID or server secret is missing from environment variables.');
		}

		const ui = ZegoUIKitPrebuilt.create(kitToken);

		ui.joinRoom({
			container: element,
			sharedLinks: [
				{
					name: 'Copy link',
					url: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
				},
			],
			scenario: {
				mode: ZegoUIKitPrebuilt.VideoConference,
			},
			turnOnMicrophoneWhenJoining: false,

			onJoinRoom: () => {
				console.log('Joined the roommm');
				setIsProcessing(true);// to start the tanstack query
				setDisplayHelperButton(true); // to show the view analytics button
			},


			onLeaveRoom: () => {
				setIsProcessing(false);
				setDisplayHelperButton(false);
				console.log('room leave....');

			},

			onInRoomMessageReceived: (data) => {
				console.log('In room message in text:', data.message);
				if (currentUser.role === 'teacher') {
					textEmotion(data, roomId, currentUser);
				}

			},


			onReturnToHomeScreenClicked: async () => {
				setIsCapturing(false);
				setIsProcessing(false);
				currentUser.role === 'teacher' ? endMeetingCall() : deleteStudentImage(roomId, currentUser.pid);
				// await videoNotesUploadEndMeet(recordedVideos.current, storage, setVideoUrls);
				await endMeetingMakeNotes();
				// window.location.href = '/dashboard/home';
				// navigate('/dashboard/home');

			},



		});
	};


	return (
		<>
			<div className="analytic-btn-modal" style={{ display: currentUser.role === 'teacher' && displayHelperButton ? 'block' : 'none' }}>

				<ChrisViewAnalytics />

			</div>

			<div className={`${currentUser.role === 'teacher' && displayHelperButton ? 'd-block' : 'd-none'}  button-record-box`}>
				<button className={`btn ${isRecording ? 'recording' : ''}`} onClick={handleSwitchChange}>
					<i className="bi bi-filetype-ai fs-4" style={{ color: 'white' }}></i>
					<span className="take-notes-text text-white p-0 m-0 fw-bold"> {isRecording ? 'Stop Recording' : 'Take Notes'}</span>
				</button>

				{/* <button className={`btn btn-primary ms-3`} onClick={handelMakingNotes} disabled={isMakingNotes}>
                    {isMakingNotes ? (
                        <div className="spinner-border spinner-border-sm text-light me-2" role="status">

                        </div>
                    ) : (

                        <i className="bi bi-journal-arrow-down fs-5 mx-2"></i>
                    )}
                    <span>{isMakingNotes ? '' : 'Save Notes'}</span>
                </button> */}

			</div>



			{/* Dialog box for Note downloade and display  */}
			<Dialog open={openNotesDialogBox} onClose={() => setOpenNotesDialogBox(false)} fullWidth maxWidth="md">
				<DialogTitle>Notes Preview</DialogTitle>
				<DialogContent dividers>
					<div ref={markdownRef}>
						<ReactMarkdown>{notes}</ReactMarkdown>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => printFormattedNotes(markdownRef, roomId)} variant="contained" color="primary">
						Print / Save as PDF
					</Button>
					<Button onClick={() => (window.location.href = "/dashboard/home")} variant="outlined">
						Close
					</Button>
				</DialogActions>
			</Dialog >

			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
				open={isMakingNotes}>
				<CircularProgress color="inherit" />
				<p className='m-0 p-0 fs-4 mx-2'>Creating notes please wait...</p>
			</Backdrop>


			<div className="mainFrame" ref={meetingUI} style={{ width: '100vw', height: '100vh' }} >

			</div>

		</>
	);

};

const RoomFrameTanStack = () => (
	<QueryClientProvider client={queryClient}>
		<TestMeet />
	</QueryClientProvider>
);

export default RoomFrameTanStack;