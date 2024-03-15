import React from 'react'
import './JoinMeetPage.css'

const JoinMeetPage = () => {
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
              <input type="text" className="form-control" id="joinCode" aria-describedby="emailHelp" />
            </div>

            <div className="or-container py-4">
              <span className="or-line"></span>
              <span className="or-text text-muted fw-bold">or</span>
              <span className="or-line"></span>
            </div>


            <div className="mb-5">
              <label for="meetLink" className="form-label">Enter a meet link</label>
              <input type="text" className="form-control" id="meetLink" />
            </div>

            <div className="btn-meet d-flex  justify-content-center">
              <button type="submit" className="btn btn-primary">Join Meet</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default JoinMeetPage