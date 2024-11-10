// App.jsx
import React, { useState } from 'react';
import { Mic, MicOff, Send, Repeat } from 'lucide-react';
import './OralSocketPage.css';

const OralSocketPage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(true);

    return (
        <div className="min-vh-100 bg-light p-4">
            <div className="container">

                <div className="card mx-auto main-container">
                    {/* Header */}
                    <div className="card-header bg-primary text-white">
                        <h1 className="h5 mb-0">AI Oral Examination</h1>
                    </div>

                    {/* Main Content */}
                    <div className="card-body">
                        {/* Video/Avatar Section */}
                        <div className="row mb-4">
                            {/* AI Avatar */}
                            <div className="col-md-6 text-center">
                                <div className={`avatar-container mx-auto mb-3 ${isAISpeaking ? 'ai-speaking' : ''}`}>
                                    <img
                                        src="https://via.placeholder.com/600"
                                        alt="AI Avatar"
                                        className="img-fluid rounded"
                                    />
                                </div>
                                {/* AI Speech Text */}
                                <div className="position-relative">
                                    <button
                                        className="btn btn-light repeat-btn shadow-sm"
                                        onClick={() => setIsAISpeaking(true)}
                                    >
                                        <Repeat size={16} />
                                    </button>
                                    <div className="speech-box border bg-light p-3 rounded">
                                        <p className="mb-0 fw-bold">
                                            Could you explain the concept of machine learning and its practical applications in today's world?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Student Video */}
                            <div className="col-md-6 text-center">
                                <div className={`video-container mx-auto mb-3 ${isRecording ? 'student-speaking' : ''}`}>
                                    <div className="student-video-placeholder d-flex align-items-center justify-content-center text-white">
                                        Student Video Feed
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Answer Section */}
                        <div className="border-top pt-4">
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    placeholder="Type your answer here..."
                                    rows="3"
                                />
                            </div>

                            {/* Controls */}
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-3">
                                    <button
                                        className={`btn border btn-icon-oral ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
                                        onClick={() => {
                                            setIsRecording(!isRecording);
                                            setIsAISpeaking(false);
                                        }}
                                    >
                                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                    </button>
                                    <button className="btn btn-primary d-flex align-items-center gap-2">
                                        <Send size={20} />
                                        Submit Answer
                                    </button>
                                </div>

                                <div className="d-flex gap-3">
                                    <button className="btn btn-secondary">
                                        Next Question
                                    </button>
                                    <button className="btn btn-danger">
                                        End Exam
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OralSocketPage;