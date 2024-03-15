import React, { useState } from 'react'
import './CreatMeetPage.css'
import { useNavigate } from 'react-router-dom';

const CreatMeetPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    meetingName: '',
    meetingDescription: '',
    meetingId: '',
  });

  const [errors, setErrors] = useState({
    meetingName: '',
    meetingDescription: '',
    meetingId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Perform validation onBlur
    if (!value) {
      setErrors({
        ...errors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
      });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation
    let newErrors = {};
    if (formData.meetingName.trim() === '') {
      newErrors = { ...newErrors, meetingName: 'Meeting title is required' };
    }
    if (formData.meetingDescription.trim() === '') {
      newErrors = { ...newErrors, meetingDescription: 'Meeting description is required' };
    }
    if (formData.meetingId.trim() === '') {
      newErrors = { ...newErrors, meetingId: 'Meeting ID is required' };
    }
    setErrors(newErrors);


    // if (Object.keys(newErrors).length !== 0) return;
    console.log(formData?.meetingId);
    if (formData.meetingId) {

      navigate(`/room/${formData.meetingId}`);
    } else {
      alert('Enter the meet id')
    }
    console.log('Create meet data ', formData);
  }



  return (
    <div className='create-meet-page-main'>
      <div className="container mt-4">

        <div className="row">
          <div className=" offset-2 col-6">
            <h1 className="text-start meet-heading">Create Meeting</h1>
          </div>
        </div>

        <div className="row mt-3 create-meet-form">
          <div className="offset-2 col-6 py-4">

            <form onSubmit={handleSubmit}>

              <div className="mb-5 meeting-title">
                <label htmlFor="meetingName" className="form-label">Meeting title</label>
                <input
                  type="text"
                  className="form-control"
                  id="meetingName"
                  name="meetingName"
                  value={formData.meetingName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby="meetingNameError"
                />
                {errors.meetingName && <p className="text-danger" id="meetingNameError">{errors.meetingName}</p>}
              </div>


              <div className="mb-5 meeting-description">
                <label htmlFor="meetingDescription" className="form-label">Meeting Description</label>
                <textarea
                  className="form-control"
                  id="meetingDescription"
                  name="meetingDescription"
                  rows="3"
                  value={formData.meetingDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Maximum 50 words"
                  aria-describedby="meetingDescriptionError"
                ></textarea>
                {errors.meetingDescription && <p className="text-danger" id="meetingDescriptionError">{errors.meetingDescription}</p>}
              </div>

              <div className="mb-5">
                <label htmlFor="meetingId" className="form-label">Meeting Id</label>
                <input
                  type="number"
                  className="form-control"
                  id="meetingId"
                  name="meetingId"
                  value={formData.meetingId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby="meetingIdError"
                />
                {errors.meetingId && <p className="text-danger" id="meetingIdError">{errors.meetingId}</p>}
              </div>

              <div className="btn-meet d-flex  justify-content-end">
                <button type="submit" className="btn btn-secondary me-3">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Meeting</button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  )
}

export default CreatMeetPage