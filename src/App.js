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
import ChrisViewAnalytics from './components/ChrisViewAnalytics/ChrisViewAnalytics';
import CreatMeetPage from './pages/CreateMeetPage/CreatMeetPage';
import JoinMeetPage from './pages/JoinMeetPage/JoinMeetPage';
import ErrorPage from './pages/404ErrorPage/ErrorPage';
import LoginImageVerify from './components/LoginImageVerify';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import TestCapture from './pages/TestCapture';
import { useEffect } from 'react';
import TestPageNotesVideo from './pages/TestPageNotesVideo';
import TestAudioList from './pages/TestAudioList';
import TestImageDelete from './pages/TestImageDelete';
import TestSidebar from './pages/SidebarTest/TestSidebar';
import TestSocket from './pages/TestSocket';// => Commented out because it's Socket
import ElevenLabTest from './pages/ElevenLabTest';
import VirtualAssistant from './components/VirtualAssistance/VirtualAssistance';
import TestVirtual from './pages/TestVirtual';
import TestLayout from './pages/TestLayout/TestLayout';
import AssesmentsPage from './pages/AssesmentsPage/AssesmentsPage';


function App() {

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.href = '/login';
    }
  }, []);







  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* <=======================Test Pages====================> */}
        <Route path='/testVideo' element={<TestPage />} />
        <Route path='/test-notes' element={<TestPageNotesVideo />} />
        <Route path='/testSecPhoto' element={<TestCapture />} />
        <Route path='/testPhoto' element={<LoginImageVerify />} />
        <Route path='/test-audio-list' element={<TestAudioList />} />
        <Route path='/test-image-delete' element={<TestImageDelete />} />
        <Route path='/test-virtual' element={<TestVirtual />} />
        <Route path='/test-socket' element={<TestSocket />} />
        <Route path='/test-11' element={<ElevenLabTest />} />
        <Route path='/test-sidebar' element={<TestLayout />}>
          <Route path='home' element={<Home />} />
        </Route>
        {/* <=======================Test Pages====================> */}
        <Route path='/view' element={<ChrisViewAnalytics />} />
        <Route path='/*' element={<ErrorPage />} />

        {/* Nested layout */}
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route path='home' element={<Home />} />
            <Route path='meetings' element={<MeetingPage />} />
            <Route path='assesments' element={<AssesmentsPage />} />
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
      <VirtualAssistant />

    </div>
  );
}

export default App;
