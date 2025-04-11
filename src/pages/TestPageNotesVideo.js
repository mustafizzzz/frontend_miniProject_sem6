import React, { useState, useRef } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import axios from "axios";
import { storage } from "../firbaseConfig";
import ReactMarkdown from 'react-markdown';

const TestPageNotesVideo = ({ roomId = "123" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMakingNotes, setIsMakingNotes] = useState(false);
  const [videoUrls, setVideoUrls] = useState([]);
  const mediaRecorderRef = useRef(null);
  const screenStreamRef = useRef(null);
  const recordedVideos = useRef([]); // Stores recorded video blobs

  const [notes, setNotes] = React.useState('');
  const markdownRef = useRef(null);

  // Start Recording
  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1920, height: 1080 },
        audio: true,
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      screenStreamRef.current = screenStream;
      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: "video/webm; codecs=vp9,opus",
      });

      let chunks = []; // Store chunks for current recording session

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: "video/webm" });
          recordedVideos.current.push(blob); // Store the full video in array
        }
      };

      screenStream.getVideoTracks()[0].onended = () => {
        console.log("Screen sharing manually stopped");
        stopRecording();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };

  // Stop recording temporarily
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  // Upload Videos & Get URLs
  const uploadVideosToFirebase = async () => {
    if (recordedVideos.current.length === 0) {
      console.warn("No recorded data to upload.");
      return [];
    }

    console.log(`Uploading ${recordedVideos.current.length} videos...`);
    const uploadedUrls = [];

    for (let i = 0; i < recordedVideos.current.length; i++) {
      const blob = recordedVideos.current[i];
      const fileName = `LectureVideosrecordings/${roomId}_${Date.now()}_${i + 1}.webm`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload ${i + 1} is ${progress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedUrls.push(url);
            console.log(`Uploaded video ${i + 1}:`, url);
            resolve();
          }
        );
      });
    }

    setVideoUrls(uploadedUrls);
    recordedVideos.current = []; // Clear stored videos after upload
    return uploadedUrls;
  };

  // Process Notes in Background & Auto Download



  const handleMakingNotes = async () => {
    let urls = [
      "https://firebasestorage.googleapis.com/v0/b/mood-lens.appspot.com/o/LectureVideosrecordings%2F123_1743514714793_2.webm?alt=media&token=9757cccb-3702-46de-9d23-6b5665b14d5b",
      "https://firebasestorage.googleapis.com/v0/b/mood-lens.appspot.com/o/LectureVideosrecordings%2F123_1743514702591_1.webm?alt=media&token=22b4bb51-75fa-4b6b-bf7c-0be0bf45133f"]

    console.log("Links: ", urls);

    setIsMakingNotes(true);
    console.log("Making notes in the background...");

    const successfulNotes = [];
    const failedNotes = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/notes/process_video",
          { meet_id: roomId, videoUrl: url }
        );
        console.log(`Notes for video ${i + 1}:`, response.data.CurrentNotes);
        successfulNotes.push(`Video ${i + 1}:\n${response.data.CurrentNotes}`);
      } catch (error) {
        console.error(`Error while saving notes for video ${i + 1}:`, error);
        failedNotes.push(url);
      }
    }

    if (successfulNotes.length === 0) {
      alert("Failed to process all notes.");
      setIsMakingNotes(false);
      return;
    }

    const notesText = successfulNotes.join("\n\n");
    setNotes(notesText);

    // // Combine all successful notes & create a text file
    // const notesText = successfulNotes.join("\n\n");
    // const blob = new Blob([notesText], { type: "text/plain" });

    // // Download the notes file
    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = `Notes_${roomId}.txt`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // Alert if any videos failed to process
    if (failedNotes.length > 0) {
      alert(`Some videos failed to process notes. Check console for details.`);
    } else {
      alert("All notes saved successfully!");
    }

    setIsMakingNotes(false);
  };

  // Function to save notes as text file
  const saveAsTextFile = () => {
    // Get the raw markdown content
    const rawMarkdown = notes;
    const blob = new Blob([rawMarkdown], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Notes_${roomId}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to print or save as PDF
  const printFormattedNotes = () => {
    // Create a new window with just the formatted content
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lecture Notes - ${roomId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          h1, h2, h3, h4 { margin-top: 20px; color: #333; }
          pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
          code { font-family: monospace; background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
          p { margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1>Lecture Notes - ${roomId}</h1>
        ${markdownRef.current.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    // Slight delay to ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
    }, 3000);
  };



  // End Meeting & Upload Videos
  const endMeeting = async () => {
    console.log("Ending meeting and uploading videos...");

    // Step 1: Upload all recorded videos
    const urls = await uploadVideosToFirebase();

    if (urls.length === 0) {
      alert("No videos to process.");
      return;
    }

    // Step 2: Start note-making in the background
    handleMakingNotes(urls);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button onClick={startRecording} disabled={isRecording} style={{ margin: "5px", padding: "10px 20px" }}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording} style={{ margin: "5px", padding: "10px 20px" }}>
        Stop Recording
      </button>
      <button onClick={endMeeting} style={{ margin: "5px", padding: "10px 20px", background: "red", color: "white" }}>
        End Meeting & Upload
      </button>

      <button onClick={handleMakingNotes} style={{ margin: "5px", padding: "10px 20px", background: "red", color: "white" }}>Make Notes</button>

      {isMakingNotes && <p style={{ color: "blue" }}>Processing notes in background...</p>}

      {notes && (
        <div className="notes-container">
          <h2>Preview of Notes</h2>
          <div className="preview-container" ref={markdownRef}>
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>

          <div className="action-buttons">
            <button onClick={saveAsTextFile}>Save as Markdown File</button>
            <button onClick={printFormattedNotes}>Print Formatted Notes / Save as PDF</button>
          </div>
        </div>
      )}

      <h3>Uploaded Videos:</h3>
      <ul>
        {videoUrls.map((url, index) => (
          <li key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer">Recording {index + 1}</a>
          </li>
        ))}
      </ul>


    </div>
  );
};

export default TestPageNotesVideo;
