import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 } from 'uuid';

const RoomFrame = () => {
    const { roomId } = useParams();
    const [images, setImages] = useState([]);

    const captureImage = () => {
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

                // Add image data URL to the images array
                setImages(prevImages => [...prevImages, imageDataURL]);
            }
        }
    };



    const meetingUI = async (element) => {
        // Generate Kit Token (unchanged)
        const appID = parseInt(process.env.REACT_APP_ZEGO_APP_ID);
        const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            v4(),
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
                // Start capturing images once the video starts playing
                setInterval(captureImage, 4000);
            }
        });
    };
    console.log(images);



    return (
        <>
            <div className="mainFrame" ref={meetingUI}>
            </div>

            <div className='image-display p-5 border'>
                <h2>Captured Images:</h2>
                <div className='border border-info p-3'>
                    {images.map((image, index) => (
                        <img key={index} src={image} alt={`Captured Image ${index}`} className='m-2 p-3 border  border-success' />
                    ))}
                </div>
            </div>
        </>
    );
};

export default RoomFrame;
