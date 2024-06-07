import React, { useState, useEffect } from 'react';
import '@livekit/components-styles';
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

const serverUrl = 'wss://shubham-manuwas-videocall-a1qt8ww1.livekit.cloud';

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://localhost:3001/getToken');
        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
        } else {
          console.error('Failed to fetch token:', response.status);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  if (!token) {
    return <div>Loading...</div>; // Show loading state while fetching token
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      style={{ height: '100vh' }}
      onConnected={() => console.log('Connected to LiveKit')}
      onError={(error) => console.error('LiveKit error:', error)}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  useEffect(() => {
    console.log('Tracks:', tracks);
  }, [tracks]);

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
