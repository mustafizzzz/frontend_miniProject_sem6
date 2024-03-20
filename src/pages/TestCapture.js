import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import { storage } from '../firbaseConfig';

const TestCapture = () => {
    const [captureInterval, setCaptureInterval] = useState(null);
    const [captureManual, setCaptureManual] = useState(false);


    const captureImage = async () => {
        try {
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

            // Close the camera stream
            stream.getVideoTracks().forEach(track => track.stop());

            // Process the captured image (e.g., send it to the server)
            processCapturedImage(imageDataURL);
        } catch (error) {
            console.error('Error capturing image:', error);
        }
    };


    const processCapturedImage = async (imageDataURL) => {
        try {
            // Create a reference to the storage location
            const storageRef = ref(storage, `testCapture/${Date.now()}`);
            // Upload the file
            const snapshot = await uploadString(storageRef, imageDataURL, 'data_url');
            console.log('Uploaded a data URL string!');
            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('File available at', downloadURL);


        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const startCapture = () => {
        // Call captureImage function immediately
        captureImage();

        // Set interval to call captureImage every 5 seconds
        const interval = setInterval(() => {
            if (!captureManual) {
                captureImage();
            }
        }, 5000);

        // Save the interval ID to state
        setCaptureInterval(interval);
    };

    const stopCapture = () => {
        // Clear the interval
        clearInterval(captureInterval);
        // Reset the interval state
        setCaptureInterval(null);
    };

    const handleCaptureManual = () => {
        setCaptureManual(true);
        captureImage();
    };

    useEffect(() => {
        // Start automatic capture when component mounts
        startCapture();

        // Clean-up function to clear the interval when component unmounts
        return () => {
            clearInterval(captureInterval);
        };
    }, []);

    return (
        <div>
            <button onClick={handleCaptureManual}>Capture Image Manually</button>
            <button onClick={stopCapture}>Stop Automatic Capture</button>
        </div>
    );
};

export default TestCapture;
