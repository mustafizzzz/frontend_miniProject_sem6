import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    LinearProgress,
    Typography,
    Box
} from '@mui/material';

const EndMeetProcess = ({ open, onClose, videoDownloadURLs, roomId }) => {

    const [processingNotes, setProcessingNotes] = useState(false);
    const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/dashboard/home'); // Replace with your target route
        onClose();
    };

    const processAINotes = async () => {
        setProcessingNotes(true);

        try {
            // Process each video URL sequentially
            for (let i = 0; i < videoDownloadURLs?.length; i++) {
                setCurrentProcessingIndex(i);
                await callSimplifyNotesAPI(videoDownloadURLs[i]);
            }
            handleNavigate();
        } catch (error) {
            console.error('Error processing AI notes:', error);
            handleNavigate();
        }
    };

    const calculateOverallProgress = () => {
        return ((currentProcessingIndex + 1) / videoDownloadURLs.length) * 100;
    };

    const callSimplifyNotesAPI = async (videoUrl) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/notes/process_video', {
                videoUrl: videoUrl,
                meet_id: roomId
            });
            console.log('Simplified notes received:', response.data);

        } catch (error) {
            console.error('Error while simplifying notes:', error);
            throw error;
        }
    };



    return (
        <Dialog
            open={open}
            onClose={() => !processingNotes && handleNavigate()}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Generate AI Notes</DialogTitle>
            <DialogContent>
                {processingNotes ? (
                    <Box className="p-4">
                        <Typography variant="body1" className="mb-4">
                            Generating AI Notes... Please wait
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mb-2">
                            Processing video {currentProcessingIndex + 1} of {videoDownloadURLs?.length}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={calculateOverallProgress()}
                            className="mb-2"
                        />
                        <Typography variant="caption" color="textSecondary">
                            Overall Progress: {Math.round(calculateOverallProgress())}%
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body1">
                        Would you like to generate AI notes from  recorded videos?
                    </Typography>
                )}
            </DialogContent>
            {!processingNotes && (
                <DialogActions>
                    <Button onClick={handleNavigate} color="primary">
                        No
                    </Button>
                    <Button
                        onClick={processAINotes}
                        color="primary"
                        variant="contained"
                        disabled={videoDownloadURLs.length === 0}
                    >
                        Generate AI Notes
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}

export default EndMeetProcess