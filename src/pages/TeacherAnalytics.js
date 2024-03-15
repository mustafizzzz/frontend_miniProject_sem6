import React from 'react';
import { Line } from 'react-chartjs-2';
import './TeacherAnalytics.css'; // Create a CSS file for styling

const TeacherAnalytics = () => {
    const weeklySessionsData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], // Add more weeks as needed
        datasets: [
            {
                label: 'Happy',
                data: [5, 8, 10, 7], // Replace with your actual data
                fill: false,
                borderColor: 'rgba(56, 142, 60, 255)',
                tension: 0.1,
            },
            {
                label: 'Confused',
                data: [3, 6, 8, 5], // Replace with your actual data for Class B
                fill: false,
                borderColor: 'rgba(211,47,47,255)',
                tension: 0.1,
            },
            {
                label: 'Surprised',
                data: [1, 2, 3, 4], // Replace with your actual data for Class B
                fill: false,
                borderColor: 'rgba(25,118,210,255)',
                tension: 0.1,
            },
            {
                label: 'Bored',
                data: [9, 3, 5, 7], // Replace with your actual data for Class B
                fill: false,
                borderColor: 'rgba(251,192,45,255)',
                tension: 0.1,
            },
            {
                label: 'Absent',
                data: [7, 5, 3, 9], // Replace with your actual data for Class B
                fill: false,
                borderColor: 'rgba(3,169,244,255)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Weeks',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sessions Conducted',
                },
            },
        },
    };

    return (
        <div className="teacher-analytics-container">
            <h3>Weekly Sessions Conducted</h3>
            <Line data={weeklySessionsData} options={chartOptions} />
        </div>
    );
};

export default TeacherAnalytics;
