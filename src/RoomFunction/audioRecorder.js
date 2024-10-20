import axios from 'axios';

// Function to start audio recording
export const startListening = async (mediaAudioRecorderRef, audioChunksRef, mediaStreamRef, setAudioList) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;
    mediaAudioRecorderRef.current = new MediaRecorder(stream);

    mediaAudioRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
    };

    mediaAudioRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioList((prev) => [...prev, { url: audioUrl, blob: audioBlob }]);
        audioChunksRef.current = []; // Reset for next recording
    };

    mediaAudioRecorderRef.current.start();
};

// Function to stop audio recording
export const stopListening = (mediaAudioRecorderRef, mediaStreamRef) => {
    mediaAudioRecorderRef.current.stop();
    mediaStreamRef.current.getTracks().forEach((track) => track.stop());
};

// Function to call the emotion detection API
export const audioEmotion = async (roomId, currentUser, getCurrentTimeTeacher, audioBlob) => {
    try {
        const response = await axios.post('https://mood-lens-server.onrender.com/api/v1/audio/audio_to_emotion', {
            meet_id: parseInt(roomId),
            host_id: currentUser.pid,
            time_stamp: getCurrentTimeTeacher(),
            studentPID: currentUser.pid,
            audio_message: audioBlob
        });
        console.log('Response from audio emotion API:', response);
    } catch (error) {
        console.error('Error in audio emotion detection:', error);
    }
};
