import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './Room.css'
import ChrisViewAnalytics from './ChrisViewAnalytics/ChrisViewAnalytics';
import { UserContext } from '../ContextApi/userContex';
import { emotionsContext } from '../ContextApi/emotionsContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

//firebase Imports
import db, { storage } from '../firbaseConfig';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { set, ref as dbref, get } from 'firebase/database';



const RoomFrame = () => {
    const { roomId } = useParams();
    const [imageData, setImageData] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { setTextEmotions, setVideoEmotions, setAudioEmotions } = useContext(emotionsContext);


    //helper function
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

        if (!isCapturing) return;
        const mainFrame = document.querySelector('.mainFrame');
        if (mainFrame) {
            const videoElement = mainFrame.querySelector('video');
            if (videoElement) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                // Set canvas dimensions to match the video element
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;

                // Draw video frame onto the canvas
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                // Convert canvas to base64 data URL
                const imageDataURL = await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                        reader.readAsDataURL(blob);
                    }, 'image/jpeg');
                });



                try {

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


                } catch (error) {
                    console.error('Error uploading image:', error);
                }
                // Add image data URL to the images array
                // setImages(prevImages => [...prevImages, imageDataURL]);
            }
        }
    };

    // <========================================>
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (isCapturing) {
    //             captureImage();
    //         }
    //     }, 3000); // Capture image every 3 seconds

    //     if (isCapturing) {
    //         setTimeout(() => {
    //             setIsCapturing(false); // Pause capturing during emotion detection
    //             emotionDetect().then(() => {
    //                 setIsCapturing(true); // Resume capturing after emotion detection
    //             });
    //         }, 15000); // Wait for 15 seconds before emotion detection
    //     }

    //     // Cleanup interval
    //     return () => clearInterval(interval);
    // }, [isCapturing]); // Re-run effect when 'isCapturing' changes

    // <====================================================>


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
            console.log('Image URLs:', imageUrls);

            // Call the API with the fetched image URLs
            const response = await axios.post('https://mood-lens-server.onrender.com/api/v1/video/video_to_emotion', {
                meet_id: parseInt(roomId),
                host_id: currentUser.hostId,
                time_stamp: getCurrentTimeTeacher(),
                imgUrls: imageUrls // Pass the fetched image URLs to the API
            });
            const { text_emotions, video_emotions, audio_emotions } = response?.data.updatedMeetReports;
            setTextEmotions(text_emotions[0]);
            setVideoEmotions(video_emotions[0]);
            setAudioEmotions(audio_emotions[0]);
            console.log('Response from emotion API:', response.data);
        } catch (error) {

            console.log('error in api calling', error.message);

        }


    };//only for teacher

    // useEffect(() => {

    //     const interval = setInterval(async () => {
    //         if (isCapturing) {
    //             console.log('Image capturing start now count  5 sec');
    //             await captureImage();
    //         }
    //     }, 5000); // Capture image every 3 seconds

    //     const runEmotionDetection = async () => {

    //         if (isCapturing && currentUser.role === 'teacher') {
    //             setIsCapturing(false); // Pause capturing during emotion detection
    //             try {
    //                 await emotionDetect();
    //                 setIsCapturing(true);
    //             } catch (error) {
    //                 console.error('Error in emotion detection:', error);
    //             }
    //         }
    //     };

    //     let timeout;

    //     if (currentUser.role === 'teacher') {
    //         timeout = setTimeout(runEmotionDetection, 15000); // Wait for 15 seconds before emotion detection
    //     }


    //     // Cleanup interval and timeout
    //     return () => {
    //         console.log('interval cleaning');
    //         clearInterval(interval);
    //         if (currentUser.role === 'teacher') {
    //             clearTimeout(timeout);
    //         }
    //     };
    // }, [isCapturing]); // Re-run effect when 'isCapturing' changes

    //test useEffect

    useEffect(() => {
        if (!isCapturing) return;
        const interval = setInterval(async () => {
            if (currentUser.role === 'teacher') {
                console.log('emotion detetction start now count  25 sec');
                await emotionDetect(); // Call emotion detection for teacher
                console.log('One call emotion detetction completed');
            } else if (currentUser.role === 'student') {
                console.log('Image capturing start now count  10 sec');
                await captureImage(); // Call image capture for student
            }

        }, currentUser.role === 'teacher' ? 25000 : 10000); // Interval based on role

        return () => clearInterval(interval);

    }, [isCapturing, currentUser]);

    // Speech-to-text functionality
    const [recognizedText, setRecognizedText] = useState('');
    const [isListening, setIsListening] = useState(true);
    const { transcript, resetTranscript } = useSpeechRecognition();

    useEffect(() => {

        const handleClick = (event) => {
            // Check if the clicked element has the target class name
            if (event.target.classList.contains('QYvze2FiFrLlotTk5Iz7')) {
                console.log('Clicked on the button');
                setIsListening(prevIsListening => !prevIsListening);
                if (!isListening) {
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

    useEffect(() => {
        if (transcript !== '') {
            setRecognizedText(transcript);
        }
    }, [transcript]);

    const startListening = () => {
        console.log('Start listening');
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopListening = () => {
        console.log('Stop listening');
        SpeechRecognition.stopListening();
        resetTranscript(); // Clear transcript when stopped
    };



    //Meeting UI Code
    const meetingUI = async (element) => {
        // Generate Kit Token (unchanged)
        const appID = parseInt(process.env.REACT_APP_ZEGO_APP_ID);
        const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            uuidv4(),
            'Your Name'
        );
        if (!appID || !serverSecret) {
            throw new Error('Zego app ID or server secret is missing from environment variables.');
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

            onJoinRoom: () => {
                setIsCapturing(true);
                console.log('Joined the roommm');
            },
            onLeaveRoom: () => {
                setIsCapturing(false);
                console.log('room leave....');

            },

            onInRoomMessageReceived: (data) => {
                setChatMessages(prevMessages => [...prevMessages, data.message]);
            },
            onReturnToHomeScreenClicked: () => {
                setIsCapturing(false);
                navigate('/dashboard/join-meet');
            }
        });
    };

    // console.log(imageData);
    console.log('%cSaved text:', 'color:blue', recognizedText);




    return (
        <>
            <div className="analytic-btn-modal" >
                <ChrisViewAnalytics />
            </div>
            {/* <div className="btn-box">
            </div> */}



            <div className="mainFrame o" ref={meetingUI} style={{ width: '100vw', height: '100vh' }} >

            </div>

            {/* {<p>Transcribed text: {recognizedText}</p>} */}

            {/* <div className='image-display p-5 border'>
                <h2>Captured Images:</h2>
                <div className='border border-info p-3'>
                    {images.map((image, index) => (
                        <img key={index} src={image} alt={`Captured Image ${index}`} className='m-2 p-3 border  border-success' />
                    ))}
                </div>
            </div> */}
        </>
    );

};

export default RoomFrame;