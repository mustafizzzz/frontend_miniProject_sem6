import React, { useState, useRef } from 'react';

const TestAudioList = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioList, setAudioList] = useState([]);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const mediaStreamRef = useRef(null); // Add a ref to store the media stream

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream; // Store the media stream
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioList((prev) => [...prev, { url: audioUrl, blob: audioBlob }]);
            audioChunksRef.current = []; // Reset chunks for next recording
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);

        // Stop all tracks of the media stream
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
    };

    return (
        <div>
            <h2>Audio Recorder</h2>
            {!isRecording ? (
                <button onClick={startRecording}>Start Recording</button>
            ) : (
                <button onClick={stopRecording}>Stop Recording</button>
            )}
            <h3>Recorded Audio:</h3>
            <ul>
                {audioList.map((audio, index) => (
                    <li key={index}>
                        <audio controls src={audio.url} />
                        <p>Audio URL: <a href={audio.url} target="_blank" rel="noopener noreferrer">{audio.url}</a></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TestAudioList;