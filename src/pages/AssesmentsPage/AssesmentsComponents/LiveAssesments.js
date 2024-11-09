import React, { useState } from 'react'
import './LiveAssesments.css';
import { RefreshCw } from 'lucide-react';

const LiveAssesments = () => {

  const liveAssessments = [
    {
      lectureTitle: 'Lecture 1',
      complete: '80',
      pending: '20',
      scheduleOn: '2024-11-08',
      endsOn: '2024-11-08',
    },
    {
      lectureTitle: 'Lecture 2',
      complete: '50',
      pending: '50',
      scheduleOn: '2024-11-09',
      endsOn: '2024-11-09',
    },
    {
      lectureTitle: 'Lecture 3',
      complete: '30',
      pending: '70',
      scheduleOn: '2024-11-10',
      endsOn: '2024-11-10',
    },
  ];

  //refresh function

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshLiveAssessment = () => {

    setIsRefreshing(true);
    setTimeout(() => {
      console.log("Refreshing live assessments...");
      setIsRefreshing(false);
    }, 2000);

  };




  return (
    <div className="container mt-4 custom-table-container">
      <div className="heading-btn-box d-flex justify-content-between align-items-center">
        <h5>Live Assessments</h5>
        <button
          className="btn border"
          onClick={refreshLiveAssessment}
          disabled={isRefreshing} // Disable button during refresh
        >
          {isRefreshing ? (
            <div className="spinner-border spinner-border-sm" role="status">
            </div>
          ) : (
            <RefreshCw size={20} />
          )}
        </button>
      </div>

      <table className="table table-borderless custom-table">
        <thead>
          <tr>
            <th>Lecture Title</th>
            <th>Completed</th>
            <th>Pending</th>
            <th>Schedule On</th>
            <th>Ends On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {liveAssessments.map((assessment, index) => (
            <tr key={index} className="custom-table-row">
              <td>{assessment.lectureTitle}</td>
              <td className="status-complete">{assessment.complete}</td>
              <td className="status-pending">{assessment.pending}</td>
              <td>{assessment.scheduleOn}</td>
              <td>{assessment.endsOn}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger end-test-btn"
                  onClick={() => alert(`Ending test for ${assessment.lectureTitle}`)}
                >
                  End Test
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LiveAssesments