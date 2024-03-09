import React from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import './AuthPage.css';
import { useFormik } from 'formik';
import { registerSchema } from '../YupSchema';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleButton from 'react-google-button';

const initialValues = {
  role: '',
  pid: '',
  username: '',
  email: '',
  password: ''
}

const Register = () => {
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      console.log('Formik values', values);
      await registerUser(values);
      action.resetForm();
    }

  })

  const registerUser = async (values) => {
    try {
      console.log(`${process.env.REACT_APP_URL} APP URL`);

      const { data } = await axios.post(`${process.env.REACT_APP_URL}/api/v1/users/register`, values);
      console.log('response in register', data.data);
      navigate('/login');

    } catch (error) {
      console.log('Error in registerUSer', error);

    }

  }
  console.log(values);



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
                        className={`btn btn-outline-primary ${values.role === 'student' ? 'active' : ''}`}
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

                      {/* userName input */}
                      <div className="form-floating mb-3">
                        <input
                          type="name"
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
                      <div className="form-floating mb-3">
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

                      {/* PID INput */}
                      <div className="form-floating mb-3">
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
                      <Button type='submit' variant="contained" className='w-100 mb-4 fw-bold'>SignUp</Button>
                      <div className="text-center">
                        <p>Already a member? <NavLink to='/login'>Login</NavLink></p>
                      </div>
                      {/* Register buttons */}
                      {/* <div className="text-center">
                        <p>or sign up with:</p>
                        <GoogleButton className='m-auto' onClick={() => { console.log('Google Clicked'); }} label='Sign up with Google' />

                      </div> */}

                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* Jumbotron */}
      </section>

    </>
  )
}

export default Register