import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { FIREBASE_DB } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useSelector } from 'react-redux'
import { RootState } from './Store'

export default function Viewer() {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeDB, setCurrentTimeDB] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoId, setVideoId] = useState('');
  const roomId = useSelector((state: RootState) => state.roomId)

  useEffect(()=>{  if (Number(Math.abs(currentTimeDB - currentTime)) > Number(2)) {
  playerRef.current.seekTo(currentTimeDB, true)
}})


  useEffect(() => {
    const currentTimeRef = ref(FIREBASE_DB, `rooms/${roomId}/currentTime`);
    const playStatusRef = ref(FIREBASE_DB, `rooms/${roomId}/playStatus`);
    const videoIdRef = ref(FIREBASE_DB, `rooms/${roomId}/videoId`);

    onValue(currentTimeRef, (snapshot) => {
      setCurrentTimeDB(snapshot.val());
    });


    

    onValue(playStatusRef, (snapshot) => {
      setPlaying(snapshot.val());
    });

    onValue(videoIdRef, (snapshot) => {
      setVideoId(snapshot.val());
    });

  }, []);

  useEffect(() => {
      const interval = setInterval(async () => {
        const time = await playerRef.current.getCurrentTime();
        setCurrentTime(time);
      }, 1000);

      return () => clearInterval(interval);
    
  }, [playing]);

  return (
    <View style={{ flex: 1 }}>
      <YoutubePlayer
        ref={playerRef}
        height={300}
        play={playing}
        videoId={videoId}
      />
      <Text>Current Time: {currentTime}</Text>
      <Text>{roomId}</Text>
    </View>
  );
}
