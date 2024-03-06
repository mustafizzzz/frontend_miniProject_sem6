import VideoFrame from './components/VideoFrame';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import RoomFrame from './components/RoomFrame';
import Login from './pages/AuthPage/Login';
import Register from './pages/AuthPage/Register';
import Home from './pages/Home/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />





        {/* Video Pages */}
        <Route path='/' element={<VideoFrame />} />
        <Route path='/room/:roomId' element={<RoomFrame />} />
      </Routes>
    </div>
  );
}

export default App;
