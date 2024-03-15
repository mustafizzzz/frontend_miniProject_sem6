import React, { useState } from 'react'
import './JoinMeetPage.css'
import { useNavigate } from 'react-router-dom';

const JoinMeetPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    joinCode: '',
    meetLink: ''
  });

  const [errors, setErrors] = useState({
    message: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newErrors = { ...errors };
    console.log('clicked');


    if (formData.message === '') {
      newErrors.joinCode = 'any one Field is required';
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      // Handle form submission
      console.log('Join meet form submitted successfully:', formData);
      navigate(`/room/${formData.joinCode || formData.meetLink}`)
    }
  }



  return (
    <div className='join-meet-page-main'>
      <div className="container mt-4">

        <div className="row">
          <div className="col-10">
            <h1 className="text-center join-heading">Join a lecture</h1>
          </div>
        </div>

        <div className="row mt-2 join-meet-form">
          <div className="offset-2 col-6 py-4">


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
        </div>

      </div>
    </div>
  )
}

export default JoinMeetPage