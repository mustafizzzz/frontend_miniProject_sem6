import React, { useState } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import './AuthPage.css';
import { useFormik } from 'formik';
import { registerSchema } from '../YupSchema';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleButton from 'react-google-button';

//firebase Imports
import db, { storage } from '../../firbaseConfig';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push, set } from 'firebase/database';


const initialValues = {
  role: '',
  pid: '',
  phone: '',
  username: '',
  email: '',
  password: '',
  disability: '',
}

const Register = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  console.log(imageFile);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      console.log('Formik values', values);
      await registerUser(values);
      action.resetForm();
    }

  });

  console.log("in form", errors);


  const registerUser = async (values) => {
    try {
      if (!imageFile) return;
      console.log(`${process.env.REACT_APP_DEPLOY_URL} APP URL`);

      // Upload image to Firebase Storage with the PID as part of the path
      console.log('Values in register hanle', values);
      const imageRef = ref(storage, `images/${values.pid}/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      console.log(imageUrl);

      // Prepare data to be stored in the database
      const registrationData = {
        pid: values.pid,
        userName: values.username,
        face_id: imageUrl, // URL of the uploaded image
        disability: values.disability,
        phone: values.phone,
      };

      const imageDataRef = push(dbRef(db, 'StudentImages'));
      set(imageDataRef, {
        Name: values.username,
        imageUrl: imageUrl
      }).then(() => {
        console.log("Image URL saved successfully!");
      }).catch((error) => {
        console.error("Error saving image URL: ", error);
      });

      const response = await axios.post(`${process.env.REACT_APP_DEPLOY_URL}/api/v1/user/face_id_signup`, registrationData);
      console.log('response in register', response.data.user);

      navigate('/login');

    } catch (error) {
      console.log('Error in registerUSer', error);

    }

  }

  // console.log(values);



  return (
    <>
      <section className='register-mainbox'>
        {/* Jumbotron */}
        <div className="px-4 py-5 px-md-5 text-center text-lg-start shadow register-content-box" style={{ backgroundColor: 'hsl(0, 0%, 96%)' }}>
          <div className="container">
            <div className="row gx-lg-5 align-items-center">

              <div className="d-none d-md-block col-lg-6 mb-5 mb-lg-0">
                <h1 className="my-5 display-3 fw-bold ls-tight">
                  Video Calls<br />
                  <span className="text-primary">MoodLens Login</span>
                </h1>
                <p style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                  quibusdam tempora at cupiditate quis eum maiores libero
                  veritatis? Dicta facilis sint aliquid ipsum atque?
                </p>
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="card">
                  <div className="card-body py-4 px-md-5">
                    <h1 className="card-title mb-4">Create a new account</h1>


                    <div className="button-role d-flex mb-3">
                      <button
                        type="button"
                        className={`btn btn-outline-primary me-3 ${values.role === 'teacher' ? 'active' : ''}`}
                        onClick={() => handleChange('role')('teacher')}
                      >
                        Teacher
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-secondary ${values.role === 'student' ? 'active' : ''}`}
                        onClick={() => handleChange('role')('student')}
                      >
                        Student
                      </button>
                      {errors.role && touched.role ?
                        (
                          <p className='text-danger ms-3 mt-2 p-0 m-0'>
                            {errors.role}
                          </p>

                        ) : null}

                    </div>


                    <form onSubmit={handleSubmit}>


                      <div className="username-name d-flex justify-content-between mb-4">


                        {/* userName input */}
                        <div className="form-floating w-100 me-3">
                          <input
                            type='text'
                            className="form-control"
                            id="floatingName"
                            placeholder="john doe"
                            name='username'
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                          <label htmlFor="floatingName">User name</label>

                          {errors.username && touched.username ?
                            (
                              <p className='text-danger ms-1 my-1'>
                                {errors.username}
                              </p>

                            ) : null}

                        </div>

                        {/* Email input */}
                        <div className="form-floating w-100">
                          <input
                            type="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            name='email'
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                          <label htmlFor="floatingInput">Email address</label>

                          {errors.email && touched.email ?
                            (
                              <p className='text-danger ms-1 my-1'>
                                {errors.email}
                              </p>

                            ) : null}

                        </div>

                      </div>

                      <div className="disablity-image d-flex justify-content-between mb-4 align-items-center">

                        {/* Disablilty ask */}
                        <div className="from-floating w-100">
                          <select
                            className="form-select p-2"
                            aria-label=".form-select-lg example"
                            name="disability"
                            value={values.disability}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="">Select your disability type</option>
                            <option value="Deaf">Deaf</option>
                            <option value="Blind">Blind</option>
                            <option value="Wheelchair User">Wheelchair User</option>
                            <option value="Intellectual Disability">Intellectual Disability</option>
                            <option value="Physical Disability">Physical Disability</option>
                            <option value="Autism">Autism</option>
                            <option value="Developmental Disability">Developmental Disability</option>
                            <option value="Cerebral Palsy">Cerebral Palsy</option>
                            <option value="Multiple Sclerosis">Multiple Sclerosis</option>
                          </select>
                          {errors.disability && touched.disability ?
                            (
                              <p className='text-danger ms-1 p-0 m-0'>
                                {errors.disability}
                              </p>

                            ) : null}
                        </div>

                        {/* ImageData */}
                        <div className="image-field w-100 ms-3">
                          {/* <label htmlFor="floatingName">Choose a image</label> */}
                          <input
                            className="form-control form-control-md"
                            type="file"
                            id="formFile"
                            placeholder="Choose a Image"
                            name='imageData'
                            accept='image/*'
                            // value={values.ImageData}
                            onChange={(event) => {
                              setImageFile(event.target.files[0]);
                            }}
                            onBlur={handleBlur} />


                          {!imageFile ?
                            (
                              <p className='text-danger ms-1 m-0'>
                                {errors.ImageData}
                              </p>

                            ) : null}

                        </div>

                      </div>


                      <div className="pid-phone  d-flex justify-content-betweens  mb-4">
                        {/* PID INput */}
                        <div className="form-floating w-100 me-3">
                          <input
                            type="number"
                            className="form-control"
                            id="floatingName"
                            placeholder="211103"
                            name='pid'
                            value={values.pid}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                          <label htmlFor="floatingName">PID</label>

                          {errors.pid && touched.pid ?
                            (
                              <p className='text-danger ms-1 my-1'>
                                {errors.pid}
                              </p>

                            ) : null}

                        </div>

                        {/* Phone INput */}
                        <div className="form-floating w-100">
                          <input
                            type="number"
                            className="form-control"
                            id="floatingName"
                            placeholder="211103"
                            name='phone'
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                          <label htmlFor="floatingName">Phone number</label>

                          {errors.phone && touched.phone ?
                            (
                              <p className='text-danger ms-1 my-1'>
                                {errors.phone}
                              </p>

                            ) : null}

                        </div>

                      </div>



                      {/* Password input */}
                      <div className="form-floating mb-4">

                        <input
                          type="password"
                          className="form-control"
                          id="floatingPassword"
                          placeholder="Password"
                          name='password'
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur} />
                        <label htmlFor="floatingPassword">Password</label>
                        {
                          errors.password && touched.password ?
                            (
                              <p className='text-danger ms-1 my-1'>
                                {errors.password}.
                              </p>

                            )
                            : null
                        }
                      </div>



                      {/* Submit button */}
                      <Button type='submit' variant="contained"

                        className='w-100 mb-2 fw-bold'>SignUp</Button>
                      <div className="text-center">
                        <p>Already a member? <NavLink to='/login'>Login</NavLink></p>
                      </div>

                      {/* Register buttons */}
                      <div className="text-center ">
                        {/* <p>or sign up with:</p> */}
                        <GoogleButton className='m-auto' onClick={() => { console.log('Google Clicked'); }} label='Sign up with Google' />

                      </div>

                    </form>


                  </div>
                </div>
              </div>

            </div>
          </div>
        </div >
        {/* Jumbotron */}
      </section >

    </>
  )
}

export default Register