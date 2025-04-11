import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";

// Function to start screen recording
export const startRecording = async (setIsRecording, mediaRecorderRef, screenStreamRef, recordedVideos) => {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { width: 1920, height: 1080 },
            audio: true,
        });

        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks(),
        ]);

        screenStreamRef.current = screenStream;
        mediaRecorderRef.current = new MediaRecorder(combinedStream, {
            mimeType: "video/webm; codecs=vp9,opus",
        });

        let chunks = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            if (chunks.length > 0) {
                const blob = new Blob(chunks, { type: "video/webm" });
                recordedVideos.current.push(blob);
            }
        };

        screenStream.getVideoTracks()[0].onended = () => {
            stopRecording(setIsRecording, mediaRecorderRef, screenStreamRef);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (error) {
        console.error("Error starting screen recording:", error);
    }
};

// Function to stop screen recording
export const stopRecording = (setIsRecording, mediaRecorderRef, screenStreamRef) => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
    }
    if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
};

// Function to upload recorded videos to Firebase
export const uploadVideosToFirebase = async (recordedVideos, storage, roomId, setVideoUrls) => {
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
    recordedVideos.current = [];
    return uploadedUrls;
};

// Function to process notes from uploaded videos
export const handleMakingNotes = async (urls, roomId = "7039", setNotes) => {
    console.log("Processing notes in the background...", urls, roomId, setNotes);

    const successfulNotes = [];
    const failedNotes = [];

    for (let i = 0; i < urls.length; i++) {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/notes/process_video", {
                meet_id: roomId,
                videoUrl: urls[i],
            });

            console.log(`Notes for video ${i + 1}:`, response.data.CurrentNotes);
            successfulNotes.push(`Video ${i + 1}:\n${response.data.CurrentNotes}`);
        } catch (error) {
            console.error(`Error processing notes for video ${i + 1}:`, error);
            failedNotes.push(urls[i]);
        }
    }

    if (successfulNotes.length === 0) {
        alert("Failed to process all notes.");

        return;
    }

    setNotes(successfulNotes.join("\n\n"));

    if (failedNotes.length > 0) {
        alert(`Some videos failed to process notes.`);
    } else {
        alert("All notes saved successfully!");
    }


};

// Function to save notes as a text file
export const saveAsTextFile = (notes, roomId) => {
    const blob = new Blob([notes], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Notes_${roomId}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Function to print formatted notes
export const printFormattedNotes = (markdownRef, roomId) => {
    const printWindow = window.open("", "_blank");

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
    setTimeout(() => {
        printWindow.print();
    }, 3000);
};
