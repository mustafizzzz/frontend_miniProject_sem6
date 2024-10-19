// import React, { useRef } from 'react';

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useRef } from 'react';
import { AlanContext } from '../ContextApi/AlanContext';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage } from '../firbaseConfig';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: 4,
    boxShadow: 15,
    p: 2,
};

const LoginImageVerify = ({ setLoginImage, setIsImageCaptured, formData, loginUserNameAlan }) => {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { openAlan, setOpenAlan, handleCloseAlanCapture } = React.useContext(AlanContext);

    React.useEffect(() => {
        if (openAlan) {
            startCamera();
            const captureTimeout = setTimeout(captureImage, 2000); // Capture image after 4 seconds
            return () => clearTimeout(captureTimeout);
        }
    }, [openAlan]); // Run when open changes



    const startCamera = () => {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(error => {

                console.error('Error accessing camera:', error);
            });
    };

    const captureImage = async () => {

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas image to base64
        const imageData = canvas.toDataURL('image/png');
        try {

            if (!imageData) {
                setIsImageCaptured(false);
                console.log('No image captured');
                return;
            }

            // Create a reference to the storage location
            const storageRef = ref(storage, `loginTemp/${formData.username || loginUserNameAlan}`);
            // Upload the file
            const snapshot = await uploadString(storageRef, imageData, 'data_url');
            console.log('Uploaded a data URL string!');
            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('File available at', downloadURL);
            setLoginImage(downloadURL);
            setIsImageCaptured(true);


        } catch (error) {
            console.error('Error uploading image:', error);
            setIsImageCaptured(false);
        }


        // Stop the media stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.style.display = 'none';
        handleCloseAlanCapture();
    };

    return (
        <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={openAlan}
                onClose={handleCloseAlanCapture}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='image-capture-frame d-flex flex-column justify-content-center align-items-center'>
                        {/* <button onClick={startCamera}>Start Camera</button>
                        <button onClick={captureImage}>Capture Image</button> */}
                        <p className='fw-bold fs-4'>Look in the camera</p>
                        <div>
                            <video ref={videoRef} width="300" height="400" autoPlay muted></video>
                        </div>
                        <div>
                            <canvas ref={canvasRef} width="400" height="400" style={{ display: 'none' }}></canvas>
                        </div>
                    </div>

                </Box>
            </Modal>
        </div>
    );




































    // const videoRef = useRef(null);
    // const canvasRef = useRef(null);

    // const startCamera = () => {
    //     navigator.mediaDevices.getUserMedia({ video: true })
    //         .then(stream => {
    //             videoRef.current.srcObject = stream;
    //         })
    //         .catch(error => {
    //             console.error('Error accessing camera:', error);
    //         });
    // };

    // const captureImage = () => {
    //     const video = videoRef.current;
    //     const canvas = canvasRef.current;
    //     const context = canvas.getContext('2d');

    //     context.drawImage(video, 0, 0, canvas.width, canvas.height);

    //     // Convert canvas image to base64
    //     const imageData = canvas.toDataURL('image/png');
    //     console.log('Captured image:', imageData);

    //     // Stop the media stream
    //     const stream = video.srcObject;
    //     const tracks = stream.getTracks();
    //     tracks.forEach(track => track.stop());
    //     video.style.display = 'none';
    // };

    // return (
    //     <div>
    //         <button onClick={startCamera}>Start Camera</button>
    //         <button onClick={captureImage}>Capture Image</button>
    //         <div>
    //             <video ref={videoRef} width="400" height="300" autoPlay muted></video>
    //         </div>
    //         <div>
    //             <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }}></canvas>
    //         </div>
    //     </div>
    // );

};

export default LoginImageVerify;
