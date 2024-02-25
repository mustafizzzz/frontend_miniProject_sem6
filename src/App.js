import VideoFrame from './components/VideoFrame';
import './App.css';
import { Route,Routes } from 'react-router-dom';
import RoomFrame from './components/RoomFrame';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<VideoFrame/>}/>
        <Route path='/room/:roomId' element={<RoomFrame/>}/>
      </Routes>
    </div>
  );
}

export default App;
