import React, { useContext, useEffect, useState } from 'react'
import './CreatMeetPage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../ContextApi/userContex';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';

const CreatMeetPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext)
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, severity: 'info', message: '' });
  const [backdropOpen, setBackdropOpen] = useState(false)

  //only for teacher
  useEffect(() => {

    if (currentUser.role === 'student') {
      navigate('/dashboard/join-meet')
    }
    // eslint-disable-next-line
  }, [])

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarInfo({ ...snackbarInfo, open: false });
  };


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
      setSnackbarInfo({ ...snackbarInfo, severity: 'error', message: 'Fill the form correctly.', open: true });
      return;
    }

    if (currentUser.role === 'teacher') {
      console.log('called the create meet');

      setBackdropOpen(true);
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
        setBackdropOpen(false);
        navigate(`/room/${response.data.meet_id}`);

      } catch (error) {
        setBackdropOpen(false);
        setSnackbarInfo({ ...snackbarInfo, severity: 'error', message: 'Error creating meeting', open: true });
        console.error('Error creating meeting:', error);
      }

    }
    console.log('Create meet data', formData);
  }

  const handleCancel = (e) => {
    setFormData({
      meetingName: '',
      meetingDescription: '',

    })
  }



  return (
    <div className='create-meet-page-main'>
      <div className="container mt-4">

        <div className="row">
          <div className="offset-3 col-6 ">
            <h1 className="text-start meet-heading">Create Meeting</h1>
          </div>
        </div>

        <div className="row mt-3 create-meet-form">
          <div className="offset-3 col-6 py-4 ">

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


              <div className="btn-meet d-flex  justify-content-end">
                <button type="submit" className="btn btn-secondary me-3" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary" >Create Meeting</button>
              </div>

            </form>

          </div>
        </div>


        {/* Backdrops and snackbar */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          open={backdropOpen}
        >
          <CircularProgress color="inherit" />
          <p className='m-0 p-0 fs-4 mx-2'>Creating meet please wait...</p>
        </Backdrop>

        <Snackbar open={snackbarInfo.open} autoHideDuration={4000} onClose={handleCloseSnackBar}>
          <Alert onClose={handleCloseSnackBar} severity={snackbarInfo.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbarInfo.message}
          </Alert>
        </Snackbar>

      </div>
    </div>
  )
}

export default CreatMeetPage