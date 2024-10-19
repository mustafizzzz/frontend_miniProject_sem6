// TestPage.js
import React, { useState, useRef, useEffect } from "react";
import { Switch } from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firbaseConfig";


const TestPage = () => {
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
        mediaRecorderRef.current.stop();
        setIsRecording(false);
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
    const handleSwitchChange = (event) => {
        if (event.target.checked) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    return (
        <div>
            <h2>Screen Recorder</h2>
            <Switch checked={isRecording} onChange={handleSwitchChange} />
            <p>{isRecording ? "Recording..." : "Recording stopped"}</p>

            {downloadURLs.length > 0 && (
                <div>
                    <h3>Uploaded Recordings</h3>
                    {downloadURLs.map((url, index) => (
                        <div key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                Download Segment {index + 1}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestPage;
