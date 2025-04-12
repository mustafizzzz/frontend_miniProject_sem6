import React from 'react'
import StatsCardComponent from './HomeComponents/StatsCardComponent/StatsCardComponent'
import TodoList from './HomeComponents/TodoList/TodoList'
import ImportantAnnouncements from './HomeComponents/Announcements/ImportantAnnouncements'
import ActivityCalendar from './HomeComponents/ActivityCalender/ActivityCalendar'


const Home = () => {
  return (
    <div className="container-fluid px-3 py-3">

      {/* Stats Cards */}
      <StatsCardComponent />

      {/* First Row: Overall Emotion + TodoList */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-info h-100">
            <div className="card-body">
              <h5 className="card-title">Overall Emotion Analysis</h5>
              {/* Add content here if needed */}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <TodoList />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Calendar + Announcements */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-info h-100">
            <div className="card-body">
              <ActivityCalendar />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <ImportantAnnouncements />
            </div>
          </div>
        </div>
      </div>

    </div>

  )
}

export default Home