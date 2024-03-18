import React, { useContext, useState } from 'react'
import './CreatMeetPage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../ContextApi/userContex';

const CreatMeetPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext)

  const [formData, setFormData] = useState({
    meetingName: '',
    meetingDescription: '',
  });

  const [errors, setErrors] = useState({
    meetingName: '',
    meetingDescription: '',
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

  //helpetr function
  const getCurrentTime = () => {
    const padZero = (num) => (num < 10 ? `0${num}` : num); // Function to pad single digits with zero

    const now = new Date(); // Get current date and time
    const hours = padZero(now.getHours()); // Get current hours and pad if necessary
    const minutes = padZero(now.getMinutes()); // Get current minutes and pad if necessary

    return `${hours}:${minutes}`; // Concatenate hours and minutes
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform validation
    let newErrors = {};
    if (formData.meetingName.trim() === '') {
      newErrors = { ...newErrors, meetingName: 'Meeting title is required' };
    }
    if (formData.meetingDescription.trim() === '') {
      newErrors = { ...newErrors, meetingDescription: 'Meeting description is required' };
    }
    setErrors(newErrors);


    // If any field is empty, show alert and return
    if (Object.keys(newErrors).length > 0) {
      alert('Please fill all required fields');
      return;
    }

    if (currentUser.role === 'teacher') {

      try {
        const createMeetingData = {
          host_id: currentUser.hostId,
          title: formData.meetingName,
          description: formData.meetingDescription,
          startTime: getCurrentTime(),
          host_name: currentUser.userName,
        }

        const response = await axios.post(`https://mood-lens-server.onrender.com/api/v1/meeting/create_meeting`, createMeetingData);

        console.log('response in create meet', response);

        navigate(`/room/${response.data.meet_id}`);

      } catch (error) {
        console.error('Error creating meeting:', error);

      }

    }

    else {
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


              <div className="mb-4 meeting-description">
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
                <p className="text-muted fw-bold">The meeting ID is automatically generated and can be shared with students.</p>
              </div>


              {/* Meeting ID  */}
              {/* <div className="mb-5">
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
              </div> */}

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