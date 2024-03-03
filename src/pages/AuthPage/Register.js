import React from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import './AuthPage.css';
import { useFormik } from 'formik';
import { registerSchema } from '../YupSchema';
import { NavLink } from 'react-router-dom';

const initialValues = {
  name: '',
  email: '',
  password: ''
}

const Register = () => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: registerSchema,
    onSubmit: (values, action) => {
      console.log('Formik values', values);
      action.resetForm();
    }

  })
  console.log(values);



  return (
    <>
      <section className='register-mainbox'>
        {/* Jumbotron */}
        <div className="px-4 py-5 px-md-5 text-center text-lg-start shadow register-content-box" style={{ backgroundColor: 'hsl(0, 0%, 96%)' }}>
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
                  <div className="card-body py-5 px-md-5">
                    <form onSubmit={handleSubmit}>
                      {/* userName input */}
                      <div className="form-floating mb-3">
                        <input
                          type="name"
                          className="form-control"
                          id="floatingName"
                          placeholder="john doe"
                          name='name'
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur} />
                        <label htmlFor="floatingName">User name</label>

                        {errors.name && touched.name ?
                          (
                            <p className='text-danger ms-1 my-1'>
                              {errors.name}
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
                      <div className="text-center">
                        <p>or sign up with:</p>
                        <button className="btn btn-light btn-lg w-75 shadow-sm" type="submit"><GoogleIcon className='me-1 mb-1' /> Sign in with google
                        </button>

                      </div>

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