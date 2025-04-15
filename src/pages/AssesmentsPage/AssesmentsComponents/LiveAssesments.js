import React, { useEffect, useState } from 'react'
import './LiveAssesments.css';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import { REACT_APP_DEPLOY } from '../../../config';
import { useNavigate } from 'react-router-dom';

const LiveAssesments = ({ liveAssesments, updateLiveAssessment, currentUser }) => {

  const navigate = useNavigate();

  //dummy data
  // const liveAssessments = [
  //   {
  //     lectureTitle: 'Lecture 1',
  //     complete: '80',
  //     pending: '20',
  //     scheduleOn: '2024-11-08',
  //     endsOn: '2024-11-08',
  //   },
  //   {
  //     lectureTitle: 'Lecture 2',
  //     complete: '50',
  //     pending: '50',
  //     scheduleOn: '2024-11-09',
  //     endsOn: '2024-11-09',
  //   },
  //   {
  //     lectureTitle: 'Lecture 3',
  //     complete: '30',
  //     pending: '70',
  //     scheduleOn: '2024-11-10',
  //     endsOn: '2024-11-10',
  //   },
  // ];

  //refresh function

  const [isRefreshing, setIsRefreshing] = useState(false);


  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
  };


  const refreshLiveAssessment = async () => {

    setIsRefreshing(true);
    const liveAssesmentsList = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/view_live_tests`, {
      createdBy: currentUser.hostId
    });
    console.log('Refresh liveAssesmentsList:', liveAssesmentsList.data);

    updateLiveAssessment(liveAssesmentsList.data);

    setIsRefreshing(false);
  };

  const handleStartTestStudent = (lectureId) => {

    // navigate(`/test-socket-new/${lectureId}`);
    const newWindowUrl = `/test-socket-new/${lectureId}`;
    window.open(newWindowUrl, '_blank');


  }




  return (
    <div className="container mt-1 custom-table-container border">
      <div className="heading-btn-box d-flex justify-content-between align-items-center">
        <h5>Live Assessments</h5>
        <button
          className="btn border"
          onClick={refreshLiveAssessment}
          disabled={isRefreshing} // Disable button during refresh
        >
          {isRefreshing ? (
            <div className="spinner-border spinner-border-sm" role="status" />
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
          {liveAssesments?.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                No live assessments available.
              </td>
            </tr>
          ) : (
            liveAssesments.map((assessment, index) => (
              <tr key={index} className="custom-table-row">
                <td>{assessment.test?.testName || "Unknown Lecture"}</td>
                <td className="status-complete">{assessment.completedCount}</td>
                <td className="status-pending">{assessment.pendingCount}</td>
                <td>{formatDate(assessment.startDateAndTime)}</td>
                <td>{formatDate(assessment.endDateAndTime)}</td>
                <td>
                  {currentUser.role === 'student' ? (
                    <button
                      className="btn btn-success start-test-btn"
                      onClick={() => handleStartTestStudent(assessment?.test?._id)}
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger end-test-btn"
                      onClick={() => alert(`Ending test for ${assessment.test?.testName || "Unknown Lecture"}`)}
                    >
                      End Test
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  )
}

export default LiveAssesments