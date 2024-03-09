import React, { useRef } from 'react';

const TestPhoto = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
            });
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas image to base64
        const imageData = canvas.toDataURL('image/png');
        console.log('Captured image:', imageData);

        // Stop the media stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.style.display = 'none';
    };

    return (
        <div>
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={captureImage}>Capture Image</button>
            <div>
                <video ref={videoRef} width="400" height="300" autoPlay muted></video>
            </div>
            <div>
                <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }}></canvas>
            </div>
        </div>
    );
};

export default TestPhoto;
