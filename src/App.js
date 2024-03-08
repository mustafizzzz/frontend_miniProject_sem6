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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/testSpeech' element={<TestPage />} />

        {/* Nested layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>


        {/* Video Pages */}
        <Route path='/' element={<VideoFrame />} />
        <Route path='/room/:roomId' element={<RoomFrame />} />
      </Routes>
    </div>
  );
}

export default App;
