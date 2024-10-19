import { useRef, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './Room.css'
import ChrisViewAnalytics from './ChrisViewAnalytics/ChrisViewAnalytics';
import { UserContext } from '../ContextApi/userContex';
import { emotionsContext } from '../ContextApi/emotionsContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

//firebase Imports for recording
import db, { storage } from '../firbaseConfig';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { set, ref as dbref, get } from 'firebase/database';

import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();
const RoomFrame = () => {

    const { roomId } = useParams();
    const [imageData, setImageData] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { setTextEmotions, setVideoEmotions, setAudioEmotions, setOverAllEmotions, setStudentLiveEmotions } = useContext(emotionsContext);
    const [isProcessing, setIsProcessing] = useState(false); // To handle loading state


    //helper function to get current time
    const getCurrentTimeStudent = () => {
        const padZero = (num) => (num < 10 ? `0${num}` : num); // Function to pad single digits with zero
        const now = new Date(); // Get current date and time
        const hours = padZero(now.getHours()); // Get current hours and pad if necessary
        const minutes = padZero(now.getMinutes()); // Get current minutes and pad if necessary
        const seconds = padZero(now.getSeconds()); // Get current seconds and pad if necessary

        return `${hours}:${minutes}:${seconds}`; // Concatenate hours, minutes, and seconds
    };

    const getCurrentTimeTeacher = () => {
        const padZero = (num) => (num < 10 ? `0${num}` : num); // Function to pad single digits with zero

        const now = new Date(); // Get current date and time
        const hours = padZero(now.getHours()); // Get current hours and pad if necessary
        const minutes = padZero(now.getMinutes()); // Get current minutes and pad if necessary

        return `${hours}:${minutes}`; // Concatenate hours and minutes
    };

    //Only for student
    const captureImage = async () => {
        if (!isCapturing && currentUser.role === 'teacher') {
            return;
        };

        // Access the camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Create a video element to capture the stream
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        // Wait for the video to load and play
        await new Promise(resolve => videoElement.addEventListener('playing', resolve));

        // Create a canvas element to capture a frame from the video
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert the captured frame to a data URL
        const imageDataURL = canvas.toDataURL('image/png');
        //stop the camera after image get captured
        stream.getTracks().forEach(track => track.stop());


        try {

            if (!imageDataURL) {
                console.log('No image data URL found');
                return;
            }
            // Construct the image path with student ID
            const studentImagePath = `InCallstudentsImage/${currentUser.pid}`;

            // Generate a unique image name using the current timestamp
            const timestamp = getCurrentTimeStudent(); // Current timestamp in "12":"33"
            const imageName = `${currentUser.pid}_${timestamp}.jpg`;

            // Upload image to Firebase Storage with the constructed image path and name
            const imageRef = ref(storage, `${studentImagePath}/${imageName}`);
            await uploadString(imageRef, imageDataURL, 'data_url');

            // Get the download URL for the uploaded image
            const downloadURL = await getDownloadURL(imageRef);

            // Construct the image path with room ID
            const roomDbPath = `Rooms/${roomId}`;

            // Upload image URL to Firebase Database with the constructed path and student PID
            await set(dbref(db, `${roomDbPath}/${currentUser.userName}`), {
                studentPID: currentUser.pid,
                imageUrl: downloadURL,
            });

            // Add image data to state
            setImageData(prevImageData => [
                ...prevImageData,
                { studentPID: currentUser.pid, imageUrl: downloadURL }
            ]);
            console.log('Image uploaded successfully:', downloadURL);




        } catch (error) {
            console.error('Error uploading image:', error);
        }
        // Add image data URL to the images array
        // setImages(prevImages => [...prevImages, imageDataURL]);


    };

    //Only for teacher
    const emotionDetect = async () => {
        try {
            // Fetch image URLs for all students under the room ID
            const roomImagesRef = dbref(db, `Rooms/${roomId}`);
            const roomImagesSnapshot = await get(roomImagesRef);

            const imageUrls = [];

            // Iterate over the student PIDs and image URLs in the snapshot
            roomImagesSnapshot.forEach((childSnapshot) => {
                const studentPID = childSnapshot.val().studentPID;
                const imageUrl = childSnapshot.val().imageUrl;

                // Add student PID and image URL to the array
                imageUrls.push({ studentPID: studentPID, imageUrl: imageUrl });
            });
            // console.log('Image URLs:', imageUrls);

            // Call the API with the fetched image URLs
            const response = await axios.post('https://mood-lens-server.onrender.com/api/v1/video/video_to_emotion', {
                meet_id: parseInt(roomId),
                host_id: currentUser.hostId,
                time_stamp: getCurrentTimeTeacher(),
                imgUrls: imageUrls // Pass the fetched image URLs to the API
            });
            const { text_emotions, video_emotions, audio_emotions } = response?.data.updatedMeetReports;
            const { overallEmotions, studentLiveEmotions } = response?.data;
            setTextEmotions(text_emotions[0]);
            setVideoEmotions(video_emotions[0]);
            setAudioEmotions(audio_emotions[0]);
            setOverAllEmotions(overallEmotions);
            setStudentLiveEmotions(studentLiveEmotions);
            console.log('Response from emotion API:', response.data);

        } catch (error) {

            console.log('error in api calling', error.message);

        }


    };


    //==================testing tanstack query====================
    const { data } = useQuery({
        queryKey: ['continuousProcess', roomId, currentUser.role],
        queryFn: async () => {
            if (currentUser.role === 'teacher') {

                await emotionDetect();

                return { status: 'emotionDetect completed' };
            } else if (currentUser.role === 'student') {
                await captureImage();
                return { status: 'captureImage completed' };
            }
            return { status: 'no action taken' }; // Handle the case where neither role matches
        },
        refetchInterval: currentUser.role == 'teacher' ? 10000 : 5000, // Interval based on role
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
                    startListening();
                } else {
                    stopListening();
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

    const startListening = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream; // Store the media stream
        mediaAudioRecorderRef.current = new MediaRecorder(stream);

        mediaAudioRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaAudioRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioList((prev) => [...prev, { url: audioUrl, blob: audioBlob }]);


            audioChunksRef.current = []; // Reset chunks for next recording
        };

        mediaAudioRecorderRef.current.start();


    };

    console.log('Audio list:', audioList);



    const stopListening = async () => {
        mediaAudioRecorderRef.current.stop();
        console.log('Stop listening');
        // Stop all tracks of the media stream
        mediaStreamRef.current.getTracks().forEach(track => track.stop());


        //send audio to emotion api logic
    };

    //only for student
    const audioEmotion = async (text) => {


        try {
            const response = await axios.post('https://mood-lens-server.onrender.com/api/v1/audio/audio_to_emotion', {
                meet_id: parseInt(roomId),
                host_id: currentUser.pid,
                time_stamp: getCurrentTimeTeacher(),
                studentPID: currentUser.pid,
                audio_message: text
            });
            // const { audio_emotions } = response?.data.updatedMeetReports;
            // setAudioEmotions(audio_emotions[0]);
            console.log('Response from audio emotion API:', response);

        } catch (error) {
            console.error('Error in audio emotion detection:', error);
        }
    }

    //<===================audio emotion end===================>



    //<===================Video recording code test===============================>

    const [isRecording, setIsRecording] = useState(false);
    const [downloadURLs, setDownloadURLs] = useState([]);
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);
    const intervalRef = useRef(null);
    const videoCount = useRef(0);

    // Start recording
    const startRecording = async () => {
        try {
            // Capture the screen stream
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { width: 7680, height: 4320 }, // 4080p quality
                audio: true, // Include system audio
            });

            // Capture the microphone audio stream
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            // Combine the screen and microphone streams
            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);

            mediaRecorderRef.current = new MediaRecorder(combinedStream, {
                mimeType: "video/webm; codecs=vp9,opus",
            });
            chunks.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.current.push(event.data);
                }
            };

            // Handle the event when screen sharing is manually stopped
            screenStream.getVideoTracks()[0].onended = () => {
                console.log('Screen sharing manually stopped');
                stopRecording(); // Automatically stop recording and save
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: "video/webm" });
                saveSegment(blob); // Save the final segment
                chunks.current = []; // Clear chunks after saving
            };

            mediaRecorderRef.current.start(1000); // Collect data every second
            setIsRecording(true);

            // Save segments every 3 minutes (180000 ms)
            intervalRef.current = setInterval(() => {
                mediaRecorderRef.current.stop(); // Stop the recording to finalize the segment
                mediaRecorderRef.current.start(); // Restart to begin a new segment
            }, 180000); // 3 minutes
        } catch (error) {
            console.error("Error starting screen recording:", error);
        }
    };

    // Stop recording
    const stopRecording = () => {
        clearInterval(intervalRef.current);
        setIsRecording(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop(); // Stop the MediaRecorder and save the video
        }
    };

    // Save video/audio segment to Firebase
    const saveSegment = (blob) => {
        const storageRef = ref(storage, `recordings/segment_${videoCount.current}.webm`);
        videoCount.current += 1;

        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error("Upload failed:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setDownloadURLs((prevURLs) => [...prevURLs, url]);
                    console.log("File available at:", url);
                });
            }
        );
    };

    // Handle switch toggle
    const handleSwitchChange = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // <===================Video recording code test end==============================>

    //Meeting UI Code
    const meetingUI = async (element) => {
        // Generate Kit Token (unchanged)
        const appID = 550381689;
        const serverSecret = '160ac07931324996010bd800396222e2';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            uuidv4(),
            `${currentUser.userName || "Your Name"}`
        );
        if (!appID || !serverSecret) {
            alert('Zego app ID or server secret is missing from environment variables.');
        }

        const ui = ZegoUIKitPrebuilt.create(kitToken);


        //text emotion api function
        const textEmotion = async (dataText) => {

            try {
                const response = await axios.post('https://mood-lens-server.onrender.com/api/v1/text/text_to_emotion', {
                    meet_id: parseInt(roomId),
                    host_id: currentUser.hostId,
                    time_stamp: getCurrentTimeTeacher(),
                    username: dataText.fromUser.userName,
                    message: dataText.message
                });

                console.log('Response from text emotion API:', response);

            } catch (error) {
                console.error('Error in audio emotion detection:', error);
            }
        }

        //end the meet api call
        const endMeetingCall = async () => {

            try {
                const response = await axios.post('https://mood-lens-server.onrender.com/api/v1/meeting/end_meeting', {
                    meet_id: parseInt(roomId),
                    endTime: getCurrentTimeTeacher(),
                });
                console.log('Response from end meeting API:', response);
                const imagesRef = ref(storage, 'InCallstudentsImage'); // Reference to the InCallstudentsImage directory

                // List all images in the InCallstudentsImage directory
                const listResponse = await listAll(imagesRef);
                const deletePromises = listResponse.items.map(item => {
                    return deleteObject(item).catch(error => {
                        console.error(`Error deleting image ${item.name}:`, error);
                    });
                });

                // Wait for all deletions to complete
                await Promise.all(deletePromises);
                console.log('All images in InCallstudentsImage deleted successfully.');

            } catch (error) {
                console.error('Error in ending meeting:', error);
            }
        }


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
                // setIsCapturing(true);
                setIsProcessing(true);
                console.log('Joined the roommm');
            },


            onLeaveRoom: () => {
                setIsProcessing(false);
                console.log('room leave....');

            },

            onInRoomMessageReceived: (data) => {
                console.log('In room message in text:', data);
                if (currentUser.role !== 'teacher') return;
                textEmotion(data);

            },
            onReturnToHomeScreenClicked: () => {
                setIsCapturing(false);
                if (currentUser.role === 'teacher') {
                    endMeetingCall();
                }
                navigate('/dashboard/join-meet');
            }


        });
    };


    return (
        <>
            <div className="analytic-btn-modal" style={{ display: currentUser.role === 'teacher' ? 'block' : 'none' }}>

                <ChrisViewAnalytics />

            </div>

            {/* <div className="button-record-box">
                <button className={`btn ${isRecording ? 'recording' : ''}`} onClick={handleSwitchChange}>
                    <i className="bi bi-filetype-ai fs-4" style={{ color: 'white' }}></i>
                    <span className="take-notes-text text-white p-0 m-0"> {isRecording ? 'Stop Recording' : 'Take Notes'}</span>
                </button>
            </div> */}

            <div className="mainFrame" ref={meetingUI} style={{ width: '100vw', height: '100vh' }} >

            </div>

        </>
    );

};

const RoomFrameTanStack = () => (
    <QueryClientProvider client={queryClient}>
        <RoomFrame />
    </QueryClientProvider>
);

export default RoomFrameTanStack;