import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

//firebase Imports
import db, { storage } from '../firbaseConfig';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { push, set } from 'firebase/database';

const RoomFrame = () => {
    const { roomId } = useParams();
    const [imageData, setImageData] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const navigate = useNavigate();


    // Function to test the connection by writing data to the database
    // const testConnection = async () => {
    //     try {
    //         const dataRef = ref(db, 'testData');
    //         await set(dataRef, 'Hello, Firebase!');
    //         console.log('Data written successfully.');
    //     } catch (error) {
    //         console.error('Error writing data:', error);
    //     }
    // };
    // testConnection();





    const captureImage = async () => {
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
                const imageDataURL = canvas.toDataURL('image/jpeg');

                try {
                    //Get the Random ID of Student
                    const studentId = Math.floor(Math.random() * 10) + 1;

                    // Construct the image path with student ID
                    const studentImagePath = `students/${studentId}`;

                    // Generate a unique image name using the current timestamp
                    const timestamp = Date.now(); // Current timestamp in milliseconds
                    const imageName = `${studentId}_${timestamp}.jpg`;

                    // Upload image to Firebase Storage with the constructed image path and name
                    const imageRef = ref(storage, `${studentImagePath}/${imageName}`);
                    await uploadString(imageRef, imageDataURL, 'data_url');

                    // Get the download URL for the uploaded image
                    const downloadURL = await getDownloadURL(imageRef);


                    // Add image data to state
                    setImageData(prevImageData => [
                        ...prevImageData,
                        { studentPID: studentId, imageUrl: downloadURL }
                    ]);


                } catch (error) {
                    console.error('Error uploading image:', error);
                }
                // Add image data URL to the images array
                // setImages(prevImages => [...prevImages, imageDataURL]);
            }
        }
    };

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

    const emotionDetect = async () => {
        console.log('Detecting .....');
        const sliceData = imageData.slice(-3);
        console.log('we have data....', imageData);
        console.log('Sliced data....', sliceData);

        try {
            const response = await axios.post('https://mood-lens-server.onrender.com/api/predict_gemini/images_to_emotions', {
                imgUrls: sliceData
            });

            console.log('Response from API:', response.data);
        } catch (error) {
            console.log('error in api calling', error.message);

        }


    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isCapturing) {
                console.log('Image capturing');
                captureImage();
            }
        }, 3000); // Capture image every 3 seconds

        const runEmotionDetection = async () => {
            if (isCapturing) {
                setIsCapturing(false); // Pause capturing during emotion detection
                try {
                    await emotionDetect();
                    setIsCapturing(true);
                } catch (error) {
                    console.error('Error in emotion detection:', error);
                }
            }
        };

        const timeout = setTimeout(runEmotionDetection, 15000); // Wait for 15 seconds before emotion detection

        // Cleanup interval and timeout
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [isCapturing]); // Re-run effect when 'isCapturing' changes




    // useEffect(() => {
    //     if (imageData.length > 5) {

    //         setTimeout(emotionDetect, 8000);


    //     }
    // }, [imageData]);


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
                navigate('/')
            }
        });
    };

    console.log(imageData);
    console.log('Is caaptur bool...', isCapturing);
    // console.log(chatMessages);



    return (
        <>
            <div className="mainFrame" ref={meetingUI} style={{ width: '100%', height: '100vh' }} >
            </div>

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
