import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function OverallEmotions({ overallEmotionData }) {



    console.log("Porps overall", overallEmotionData);

    // Original data from API
    const rawData = {
        "text_emotions": {
            "happy": 44,
            "surprised": 7,
            "confused": 31,
            "bored": 18,
            "pnf": 0
        },
        "video_emotions": {
            "happy": 349,
            "surprised": 63,
            "confused": 1485,
            "bored": 196,
            "pnf": 829
        },
        "audio_emotions": {
            "happy": 36,
            "surprised": 9,
            "confused": 23,
            "bored": 17,
            "pnf": 0
        }
    };

    // Transform data for comparison chart
    const emotionTypes = ['happy', 'surprised', 'confused', 'bored', 'pnf'];

    const comparisonData = emotionTypes.map(emotion => ({
        name: emotion,
        text: overallEmotionData?.text_emotions[emotion] || 0,
        video: overallEmotionData?.video_emotions[emotion] || 0,
        audio: overallEmotionData?.audio_emotions[emotion] || 0
    }));

    return (
        <div className="container mt-4 p-0 m-0">
            <div className="card m-0 p-0">
                <div className="card-body m-0 p-0">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={comparisonData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="text" name="Text" fill="#0d6efd" />
                            <Bar dataKey="video" name="Video" fill="#198754" />
                            <Bar dataKey="audio" name="Audio" fill="#ffc107" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}