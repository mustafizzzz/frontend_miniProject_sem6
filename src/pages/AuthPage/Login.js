import React, { useContext, useEffect } from 'react'
// import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import './AuthPage.css';
import { useFormik } from 'formik';
import { loginSchema } from '../YupSchema';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../ContextApi/userContex';
import GoogleButton from 'react-google-button'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../firbaseConfig';



const initialValues = {
  username: '',
  // password: ''
}

const Login = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      console.log('Formik values', values);
      await loginUser(values);
      action.resetForm();
    }
  })


  const loginUser = async (values) => {
    console.log('in LoginUSre', values);
    try {
      console.log(`${process.env.REACT_APP_URL} APP URL`);

      const { data } = await axios.post(`${process.env.REACT_APP_URL}/api/v1/users/login`, values);
      setCurrentUser(data.data);
      navigate('/home');
      console.log('response', data.data);

    } catch (error) {
      console.log('Error in loginUser', error);

    }

  }
  console.log(values);

  //google login
  const googleLoginHandle = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider)
      console.log('after sign inn goolgle', user);
      const googleUser = user;
      const googleData = {
        displayName: googleUser?.displayName,
        email: googleUser?.email
      }
      console.log('google data format', googleData);
      const { data } = await axios.post(`${process.env.REACT_APP_URL}/api/v1/users/google-sign-in`, googleData);
      setCurrentUser(data.data);
      console.log('google data', data.data);
      navigate('/home');
    } catch (error) {
      console.log('error in google login', error);

    }

  }

  return (
    <>
      <section className='login-mainbox'>
        {/* Jumbotron */}
        <div className="px-4 py-5 px-md-5 text-center text-lg-start shadow login-content-box" style={{ backgroundColor: 'hsl(0, 0%, 96%)' }}>
          <div className="container">
            <div className="row gx-lg-5 align-items-center">

              <div className="col-lg-6 mb-5 mb-lg-0">
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
                    <h1 className="card-title mb-4">Login</h1>
                    <form onSubmit={handleSubmit}>
                      {/* Email input */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          name='uesrname'
                          value={values.username}
                          onChange={handleChange}
                          onBlur={handleBlur} />
                        <label htmlFor="floatingInput">User name</label>

                        {errors.username && touched.username ?
                          (
                            <p className='text-danger ms-1 my-1'>
                              {errors.username}
                            </p>

                          ) : null}

                      </div>



                      {/* Password input */}
                      {/* <div className="form-floating mb-4">

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
                      </div> */}

                      {/* Image verify */}
                      <div className="labels-main">
                        <div className="lable-field-box d-flex border px-3 py-2  mb-3 align-items-center justify-content-between">
                          <div className="text-div d-flex align-items-center">
                            <i className="bi bi-card-image fs-4 me-3"></i>
                            <p className='p-0  mb-0'>Image verification</p>
                          </div>
                          <div className="icon-div d-flex">
                            <i className="bi bi-x fs-2"></i>
                            <i className="bi bi-patch-check fs-3"></i>

                          </div>


                        </div>
                      </div>

                      {/* Submit button */}
                      <Button type='submit' variant="contained" className='w-100 mb-4 fw-bold'>Login</Button>
                      <div className="text-center">
                        <p>Not a member? <NavLink to='/register'>Register</NavLink></p>
                      </div>
                      {/* Register buttons */}
                      {/* <div className="text-center">
                        <p>or sign up with:</p>
                        <GoogleButton className='m-auto' onClick={googleLoginHandle} label='Sign up with Google' />
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

export default Login