import React from 'react'
import './PastAssesments.css'
import { Download } from 'lucide-react';
const PastAssesments = () => {

    const pastAssessments = [
        {
            lectureTitle: 'Lecture 1',
            attended: 45,
            missed: 5,
            highestScore: 90,
            start: '2024-11-08',
            end: '2024-11-08',
        },
        {
            lectureTitle: 'Lecture 2',
            attended: 40,
            missed: 10,
            highestScore: 85,
            start: '2024-11-09',
            end: '2024-11-09',
        },
        {
            lectureTitle: 'Lecture 3',
            attended: 50,
            missed: 0,
            highestScore: 95,
            start: '2024-11-10',
            end: '2024-11-10',
        },
    ];



    const downloadReport = (assessment) => {
        alert("Clicked on download report")
    };

    return (
        <div className="container mt-4 custom-table-container">
            <div className="heading-btn-box d-flex justify-content-between align-items-center">
                <h5>Past Assessments</h5>
            </div>

            <table className="table table-borderless custom-table">
                <thead>
                    <tr>
                        <th>Lecture Title</th>
                        <th>Attended</th>
                        <th>Missed</th>
                        <th>Highest Score</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pastAssessments.map((assessment, index) => (
                        <tr key={index} className="custom-table-row">
                            <td>{assessment.lectureTitle}</td>
                            <td className='status-attend'>{assessment.attended}</td>
                            <td className='status-missed'>{assessment.missed}</td>
                            <td className='high-score'>{assessment.highestScore}%</td>
                            <td>{assessment.start}</td>
                            <td>{assessment.end}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => downloadReport(assessment)}
                                    title="Download Report"
                                >
                                    <Download size={15} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PastAssesments