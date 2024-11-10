import React from 'react'
import StatsCardComponent from './HomeComponents/StatsCardComponent/StatsCardComponent'


const Home = () => {
  return (
    <div className='container-fluid p-0 m-0'>


      {/* Stats Cards Components */}
      <StatsCardComponent />


      <div className="row m-0 p-0 mb-5 justify-content-evenly" style={{ height: '80px' }}>
        <div className="col-md-5 border border-info" style={{ borderRadius: '0.5rem' }}>
          OverAll Emotion Anslysis
        </div>
        <div className="col-md-5 border border-info" style={{ borderRadius: '0.5rem' }}>
          Todo List for teacher
        </div>
      </div>

      <div className="row m-0 p-0 mb-3 justify-content-evenly" style={{ height: '80px' }}>
        <div className="col-md-5 border border-info" style={{ borderRadius: '0.5rem' }}>
          Activity Calender for Teacher
        </div>
        <div className="col-md-5 border border-info" style={{ borderRadius: '0.5rem' }}>
          Importan Announcements for Student
        </div>
      </div>

    </div>
  )
}

export default Home