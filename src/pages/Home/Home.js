import React, { useContext, useEffect, useState } from 'react'
import StatsCardComponent from './HomeComponents/StatsCardComponent/StatsCardComponent'
import TodoList from './HomeComponents/TodoList/TodoList'
import ImportantAnnouncements from './HomeComponents/Announcements/ImportantAnnouncements'
import ActivityCalendar from './HomeComponents/ActivityCalender/ActivityCalendar'
import OverallEmotion from './HomeComponents/OverallEmotion/OverallEmotion'
import axios from 'axios'
import { REACT_APP_DEPLOY } from '../../config'
import { UserContext } from '../../ContextApi/userContex'


const Home = () => {
  const [overallEmotionData, setOverallEmotionData] = useState(null);
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    async function fectData() {
      try {
        const response = await axios.post(`${REACT_APP_DEPLOY}/api/v1/teacher_reports/get_emotions_totals`, { host_id: currentUser.hostId });
        console.log(response.data.totalEmotions);
        setOverallEmotionData(response.data.totalEmotions)
      } catch (error) {
        console.error("Error in getting the overall emotion");


      }
    }
    fectData();
  }, [])
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
              <OverallEmotion overallEmotionData={overallEmotionData} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card  border-info h-100">
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
          <div className="card  border-info h-100">
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