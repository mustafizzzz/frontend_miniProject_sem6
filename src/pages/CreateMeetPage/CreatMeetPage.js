import React from 'react'
import './CreatMeetPage.css'

const CreatMeetPage = () => {
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

            <form>
              <div className="mb-5 meeting-title">
                <label for="meetingName" className="form-label">Meeting title</label>
                <input type="text" className="form-control" id="meetingName" aria-describedby="emailHelp" />
              </div>

              <div className="mb-5 meeting-description">
                <label for="meetingDescription" className="form-label">Meeting Description</label>
                <textarea className="form-control" id="meetingDescription" rows="3" placeholder='Maximum 50 words'></textarea>
              </div>

              <div className="mb-5">
                <label for="meetingId" className="form-label">Meeting Id</label>
                <input type="number" className="form-control" id="meetingId" />
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