import React, { useState } from 'react'
import './JoinMeetPage.css'
import { useNavigate } from 'react-router-dom';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import { set } from 'firebase/database';

const JoinMeetPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    joinCode: '',
    meetLink: ''
  });

  const [errors, setErrors] = useState({
    message: ''
  });

  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, severity: 'info', message: '' });
  const [backdropOpen, setBackdropOpen] = useState(false)

  //close snackbar
  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarInfo({ ...snackbarInfo, open: false });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setErrors({ ...errors, [name]: 'Any one field is required' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackdropOpen(true);
    // Perform validation
    let newErrors = {};
    if (formData.joinCode.trim() === '' && formData.meetLink.trim() === '') {
      newErrors = { ...newErrors, meetingName: 'Any one field is required' };
    }
    setErrors(newErrors);


    // If any field is empty, show alert and return
    if (Object.keys(newErrors).length > 0) {
      setBackdropOpen(false);
      setSnackbarInfo({ open: true, severity: 'error', message: 'Any one field is required' });
      return;
    }
    console.log('Join meet form submitted successfully:', formData);

    //is meet link is not empty then navigate to meet link
    if (formData.meetLink.trim() !== '') {
      setBackdropOpen(false);
      navigate(`/${formData.meetLink}`);
      return;
    }


    try {
      const response = await axios.post(`https://mood-lens-server.onrender.com/api/v1/meeting/join_meeting`,
        {
          meet_id: parseInt(formData.joinCode)
        });
      console.log('Join meet form submitted successfully:', response.message);
      if (response) {
        setSnackbarInfo({ open: true, severity: 'success', message: 'Meeting joined successfully' });
        setBackdropOpen(false);
        navigate(`/room/${formData.joinCode}`)

      }



    } catch (error) {
      console.log('Join meet form submitted error:', error);
      setBackdropOpen(false);
      setSnackbarInfo({ open: true, severity: 'error', message: 'Meeting not found' });

    }


  }



  return (
    <div className='join-meet-page-main'>
      <div className="container mt-4">

        <div className="row">
          <div className="col-11 px-0">
            <h1 className="text-center join-heading">Join a lecture</h1>
          </div>
        </div>

        <div className="row mt-2 join-meet-form">
          <div className="offset-3 col-5 py-4 px-0">


            <div className="mb-3">
              <label for="joinCode" className="form-label">Enter a code</label>
              <input type="text" className="form-control" id="joinCode" aria-describedby="emailHelp"
                name="joinCode"
                value={formData.joinCode}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.joinCode && <p className="text-danger">{errors.joinCode}</p>}

            </div>

            <div className="or-container py-4">
              <span className="or-line"></span>
              <span className="or-text text-muted fw-bold">or</span>
              <span className="or-line"></span>
            </div>


            <div className="mb-5">
              <label for="meetLink" className="form-label">Enter a meet link</label>
              <input type="text" className="form-control" id="meetLink"
                name="meetLink"
                value={formData.meetLink}
                onChange={handleChange}
                onBlur={handleBlur} />
              {errors.meetLink && <p className="text-danger">{errors.meetLink}</p>}
            </div>

            <div className="btn-meet d-flex  justify-content-center">
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Join Meet</button>
            </div>

          </div>

          {/* Backdrops and snackbar */}
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            open={backdropOpen}
          >
            <CircularProgress color="inherit" />
            <p className='m-0 p-0 fs-4 mx-2'>Joining please wait...</p>
          </Backdrop>


        </div>

      </div>
      {/* Common snackbar */}
      <Snackbar open={snackbarInfo.open} autoHideDuration={4000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity={snackbarInfo.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default JoinMeetPage