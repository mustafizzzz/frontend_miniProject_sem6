import React, { useState } from 'react';
import './CreateInstantMeet.css'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';

const CreateInstantMeet = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = () => {
        // Add logic for creating a meeting, such as API call
        console.log('Meeting Created:', { title, description });
        onClose(); // Close the dialog after creation
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="text-dark">Create Meeting</DialogTitle>
            <DialogContent dividers>
                <div className="form-group">
                    <label htmlFor="meetingTitle">Meeting Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="meetingTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter meeting title"
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="meetingDescription">Meeting Description</label>
                    <textarea
                        className="form-control"
                        id="meetingDescription"
                        rows="2"
                        maxLength="50"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter meeting description (max 50 words)"
                    />
                    <small className="form-text text-muted">
                        {description.length}/50 words
                    </small>
                </div>
                <Typography variant="body2" className="text-secondary mt-3">
                    Note: The meeting ID is automatically generated and can be shared with students.
                </Typography>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-outline-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Create
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateInstantMeet