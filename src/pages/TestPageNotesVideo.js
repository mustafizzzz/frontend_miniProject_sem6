import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../firbaseConfig";

const TestPageNotesVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoURL, setVideoURL] = useState("");

    // Function to handle file upload
    const uploadVideoToFirebase = (file) => {
        const storageRef = ref(storage, `recordings/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Error uploading video:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setVideoURL(downloadURL);
                });
            }
        );
    };

    // Handle file input
    const handleFileInput = (event) => {
        setVideoFile(event.target.files[0]);
    };

    // Handle upload button click
    const handleUploadClick = () => {
        if (videoFile) {
            uploadVideoToFirebase(videoFile);
        }
    };

    return (
        <div>
            <h2>Upload Video to Firebase</h2>
            <input type="file" accept="video/*" onChange={handleFileInput} />
            <button onClick={handleUploadClick}>Upload Video</button>

            {uploadProgress > 0 && (
                <p>Upload Progress: {Math.round(uploadProgress)}%</p>
            )}

            {videoURL && (
                <div>
                    <h4>Video Uploaded:</h4>
                    <a href={videoURL} target="_blank" rel="noreferrer">
                        {videoURL}
                    </a>
                </div>
            )}
        </div>
    );
};

export default TestPageNotesVideo;
