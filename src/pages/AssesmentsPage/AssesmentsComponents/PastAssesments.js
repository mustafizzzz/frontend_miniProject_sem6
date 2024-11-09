import React from 'react'
import './PastAssesments.css'
import { Download } from 'lucide-react';
const PastAssesments = ({ pastAssesments }) => {

    const downloadReport = (assessment) => {
        alert("Clicked on download report")
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    console.log("Past Assesments", pastAssesments);


    return (

        <div className="container mt-1 custom-table-container border">
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
                    {pastAssesments?.map((assessment, index) => (
                        <tr key={index} className="custom-table-row">
                            <td>{assessment.test.testName}</td>
                            <td className='status-attend'>{assessment.completedCount}</td>
                            <td className='status-missed'>{assessment.pendingCount}</td>
                            <td className='high-score'>{assessment.highestScore}%</td>
                            <td>{formatDate(assessment.startDateAndTime)}</td>
                            <td>{formatDate(assessment.endDateAndTime)}</td>
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