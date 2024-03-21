import VideoFrame from './components/VideoFrame';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import RoomFrame from './components/RoomFrame';
import Login from './pages/AuthPage/Login';
import Register from './pages/AuthPage/Register';
import Home from './pages/Home/Home';
import TestPage from './pages/TestPage';
import AboutUs from './pages/AboutUs/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import ReportsPage from './pages/ReportsPage/ReportsPage';
import MeetingPage from './pages/MeetingPage/MeetingPage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import SettingPage from './pages/SettingPage/SettingPage';
import AlanAiContainer from './components/AlanAIContainer/AlanAiContainer';
import ChrisViewAnalytics from './components/ChrisViewAnalytics/ChrisViewAnalytics';
import CreatMeetPage from './pages/CreateMeetPage/CreatMeetPage';
import JoinMeetPage from './pages/JoinMeetPage/JoinMeetPage';
import ErrorPage from './pages/404ErrorPage/ErrorPage';
import LoginImageVerify from './components/LoginImageVerify';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import TestCapture from './pages/TestCapture';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/testSpeech' element={<TestPage />} />
        <Route path='/testSecPhoto' element={<TestCapture />} />
        <Route path='/testPhoto' element={<LoginImageVerify />} />
        <Route path='/view' element={<ChrisViewAnalytics />} />
        <Route path='/*' element={<ErrorPage />} />

        {/* Nested layout */}
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route path='home' element={<Home />} />
            <Route path='meetings' element={<MeetingPage />} />
            <Route path='reports' element={<ReportsPage />} />
            <Route path='feedback' element={<FeedbackPage />} />
            <Route path='setting' element={<SettingPage />} />
            <Route path='about-us' element={<AboutUs />} />
            <Route path='create-meet' element={<CreatMeetPage />} />
            <Route path='join-meet' element={<JoinMeetPage />} />
          </Route>
        </Route>


        {/* Video Pages */}
        <Route element={<ProtectedRoute />}>
          {/* <Route path='/' element={<VideoFrame />} /> */}
          <Route path='/room/:roomId' element={<RoomFrame />} />
        </Route>


      </Routes>
      <AlanAiContainer />
    </div>
  );
}

export default App;
