import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import React, { useState } from 'react';

const TestPage = () => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [isInCall, setIsInCall] = useState(false);

    const handleJoinCall = () => {
        if (!username || !roomId) {
            alert('Please enter username and room ID');
            return;
        }

        setIsInCall(true);
    };

    const initializeZegoCloud = (element) => {
        if (!element) return;

        const appID = 1703483768; // Replace with your Zego App ID
        const serverSecret = '07a7144d947c0f58c0d6284fc7c0bd8b'; // Replace with your server secret

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            Date.now().toString(),
            username
        );

        const zegoCloud = ZegoUIKitPrebuilt.create(kitToken);

        zegoCloud.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference
            },
            turnOnMicrophoneWhenJoining: true,
            turnOnCameraWhenJoining: true,
            showMyCameraToggleButton: true,
            showMyMicrophoneToggleButton: true,
            onLeaveRoom: () => {
                setIsInCall(false);
            }
        });
    };

    return (
        <div className="container mt-5">
            {!isInCall ? (
                <div className="card">
                    <div className="card-header">
                        <h2>Join Video Call</h2>
                    </div>
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Your Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleJoinCall}
                        >
                            Join Call
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    ref={initializeZegoCloud}
                    style={{ width: '100%', height: '100vh' }}
                />
            )}
        </div>
    );
};

export default TestPage;