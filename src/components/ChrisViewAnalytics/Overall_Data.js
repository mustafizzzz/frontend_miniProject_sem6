// StudentDetailsPage.js
import React, { useState } from 'react';
import './StudentDetailsPage.css';

const StudentDetailsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentData = [
    { name: 'John Doe', emotionOverall: 'Happy', emotionAudio: 'Happy', emotionText: 'Surprised', emotionVideo: 'Happy' },
    { name: 'Chris Dias', emotionOverall: 'Happy', emotionAudio: 'Absent', emotionText: 'Confused', emotionVideo: 'Surprised' },
    { name: 'Sam Altman', emotionOverall: 'Happy', emotionAudio: 'Confused', emotionText: 'Happy', emotionVideo: 'Bored' },
    { name: 'Joy Dias', emotionOverall: 'Happy', emotionAudio: 'Confused', emotionText: 'Happy', emotionVideo: 'Bored' },
  ];

  const emotionColorMap = {
    Happy: 'rgba(56, 142, 60, 255)',
    Surprised: 'rgba(25, 118, 210, 255)',
    Confused: 'rgba(211, 47, 47, 255)',
    Bored: 'rgba(251, 192, 45, 255)',
    Absent: 'rgba(3, 169, 244, 255)',
  };

  const handleStudentClick = (name) => {
    setSelectedStudent((prevSelected) => (prevSelected === name ? null : name));
  };

  return (
    <div>
      {/* 
      OverAll data
      <h3>Overall Analysis for Each Student</h3>
      {studentData.map((student, index) => (
        <div
          key={index}
          className={`student-container ${selectedStudent === student.name ? 'show-details' : ''}`}
          onClick={() => handleStudentClick(student.name)}
        >
          <p>Name: {student.name}</p>
          <p>
            Overall Emotion: <span style={{ color: emotionColorMap[student.emotionOverall] }}>{student.emotionOverall}</span>
          </p>
          {selectedStudent === student.name && (
            <div className="student-details">
              <p>
                Emotion (Audio): <span style={{ color: emotionColorMap[student.emotionAudio] }}>{student.emotionAudio}</span>
              </p>
              <p>
                Emotion (Text): <span style={{ color: emotionColorMap[student.emotionText] }}>{student.emotionText}</span>
              </p>
              <p>
                Emotion (Video): <span style={{ color: emotionColorMap[student.emotionVideo] }}>{student.emotionVideo}</span>
              </p>
            </div>
          )}
        </div>
      ))} */}
    </div>
  );
};

export default StudentDetailsPage;
