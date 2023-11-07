import React, { useState, useRef, useEffect } from 'react';
import { View, Text,  TextInput } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { FIREBASE_DB } from '../firebaseConfig';
import { ref,  set, } from 'firebase/database';
import {  useSelector } from 'react-redux'
import { RootState } from './Store'


export default function Admin() {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=iee2TATGMyI');
  const [videoId, setVideoId] = useState('');
  const roomId = useSelector((state: RootState) => state.roomId)
  useEffect(() => {
    const currentTimeRef = ref(FIREBASE_DB, `rooms/${roomId}/currentTime`);
      const interval = setInterval(async () => {
        const time = await playerRef.current.getCurrentTime();
        setCurrentTime(time);
        set(currentTimeRef, currentTime);
      }, 1000);
      return () => clearInterval(interval);
  },);
  useEffect(() => {
    const videoIdRef = ref(FIREBASE_DB, `rooms/${roomId}/videoId`);
        set(videoIdRef, videoId);
  },);
  const onStateChange = async (state) => {
    const playStatusRef = ref(FIREBASE_DB, `rooms/${roomId}/playStatus`);
    if (state === 'playing') {
        setPlaying(true);
        set(playStatusRef, true);
      } else if (state === 'paused' || state === 'ended') {
        setPlaying(false);
        set(playStatusRef, false);
      }
  };
  useEffect(() => {
    const getVideoId = (url) => {
        const urlParts = url.split(/[?&]/);
        let id = '';
        urlParts.forEach(part => {
            if (part.startsWith('v=')) {
                id = part.replace('v=', '');
            }
        });
        return id;
    };

    const id = getVideoId(videoUrl);
    setVideoId(id);
}, [videoUrl]);
return (
  <View style={{ flex: 1 }}>

    <YoutubePlayer
      ref={playerRef}
      height={300}
      play={playing}
      videoId={videoId}
      onChangeState={onStateChange}
    />
    <Text>Current Time: {currentTime}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    </View>
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => setVideoUrl(text)}
      value={videoUrl}
    />
     <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      value={roomId}
    />
    </View>
);
}
