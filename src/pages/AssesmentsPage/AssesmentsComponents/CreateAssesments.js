import React, { useState } from 'react'
import './CreateAssesments.css';
import CreateAssesmentBox from './CreateAssesmentBox';

const CreateAssesments = () => {

    const [selectedLecture, setSelectedLecture] = useState(null);

    const lectures = [
        {
            lectureTitle: 'Lecture 1',
            date: '2024-11-08',
            duration: '1 hour',
            assessmentStatus: 'Not Created',
        },
        {
            lectureTitle: 'Lecture 2',
            date: '2024-11-09',
            duration: '1.5 hours',
            assessmentStatus: 'Created',
        },
        {
            lectureTitle: 'Lecture 3',
            date: '2024-11-10',
            duration: '2 hours',
            assessmentStatus: 'Not Created',
        },
    ];

    //craete assesment dialog
    const [openCreateAssesment, setOpenCreateAssesment] = useState(false);

    const handleCreateAssesmentClose = () => {
        setOpenCreateAssesment(false);
    }

    const handleCreateAssesmentopne = () => {
        setOpenCreateAssesment(true);
    }



    return (

        <div className="container mt-4 custom-table-container">
            <div className="heading-btn-box d-flex justify-content-between align-items-center">
                <h5>Schedule a Test</h5>
                <button
                    className="btn create-assesments-btn"
                    disabled={selectedLecture === null}
                    onClick={handleCreateAssesmentopne}
                >
                    Create
                </button>
            </div>

            <table className="table table-borderless custom-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Lecture Title</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Assessment Status</th>
                    </tr>
                </thead>
                <tbody>
                    {lectures.map((lecture, index) => (
                        <tr key={index} className="custom-table-row">
                            <td>
                                <input type="radio"
                                    name="lecture"
                                    onChange={() => setSelectedLecture(index)} />
                            </td>
                            <td>{lecture.lectureTitle}</td>
                            <td className="lecture-date">{lecture.date}</td>
                            <td><span className="lecture-duration">{lecture.duration}</span></td>
                            <td>
                                <span className={`status-badge ${lecture.assessmentStatus === 'Created' ? 'created' : 'not-created'}`}>
                                    {lecture.assessmentStatus}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <CreateAssesmentBox open={openCreateAssesment} onClose={handleCreateAssesmentClose} />

        </div>
    )
}

export default CreateAssesments