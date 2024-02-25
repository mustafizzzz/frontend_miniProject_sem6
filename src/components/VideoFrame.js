import React from 'react'
import { useNavigate } from 'react-router-dom'

const VideoFrame = () => {
  const [roomId, setRoomId] = React.useState('')
  const navigate = useNavigate();

  const handelJoin = () => {
    console.log(roomId);
    navigate(`room/${roomId}`);

  }


  return (
    <>
      <h1>VideoFrame</h1>
      <input type="text"
        placeholder='Enter the Room Id'
        value={roomId}
        onChange={(e) => { setRoomId(e.target.value) }} />
      <button onClick={handelJoin}>Join</button>
    </>

  )
}

export default VideoFrame