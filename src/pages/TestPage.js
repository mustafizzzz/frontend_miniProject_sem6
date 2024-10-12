// src/components/ScreenRecorder.js
import React, { useState, useRef } from 'react';
import { storage } from '../firbaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


const TestPage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [downloadURL, setDownloadURL] = useState('');
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);

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
                mimeType: 'video/webm; codecs=vp9,opus',
            });
            chunks.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'video/webm' });
                uploadRecording(blob);
                // Stop all tracks to release resources
                combinedStream.getTracks().forEach((track) => track.stop());
                screenStream.getTracks().forEach((track) => track.stop());
                audioStream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting screen recording:', error);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const uploadRecording = (blob) => {
        const storageRef = ref(storage, `recordings/${Date.now()}.webm`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setDownloadURL(url);
                    console.log('File available at:', url);
                });
            }
        );
    };

    return (
        <div>
            <h2>Screen Recorder</h2>
            {!isRecording ? (
                <button onClick={startRecording}>Start Recording</button>
            ) : (
                <button onClick={stopRecording}>Stop Recording</button>
            )}

            {downloadURL && (
                <div>
                    <p>Recording uploaded successfully:</p>
                    <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                        Download Link
                    </a>
                </div>
            )}
        </div>
    );
};


export default TestPage;
