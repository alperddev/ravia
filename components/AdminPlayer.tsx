import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  TextInput,
  Dimensions,
} from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'
import {  ref,  set } from 'firebase/database'
import { useSelector } from 'react-redux'
import { RootState } from '../app/Store'
import { db} from '../firebaseConfig'

export default function AdminPlayer() {
  const roomId = useSelector((state: RootState) => state.roomId)
  const playerRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState(
    'https://www.youtube.com/watch?v=iee2TATGMyI'
  )
  const [videoId, setVideoId] = useState('')
  const windowWidth = (Dimensions.get('window').width -5);
  const windowHeight = windowWidth * (9 / 16);  
useEffect(() => {
  const currentTimeRef = ref(db, `rooms/${roomId}/currentTime`)
  let interval;
  
  const getCurrentTime = async () => {
    const time = await playerRef.current.getCurrentTime()
    setCurrentTime(time)
    set(currentTimeRef, currentTime)
  }

  interval = setInterval(getCurrentTime, 1000)

  return () => {
    clearInterval(interval)
  }
}, [roomId, currentTime])


  useEffect(() => {
    const videoIdRef = ref(db, `rooms/${roomId}/videoId`)
    set(videoIdRef, videoId)
  }, [roomId, videoId])

  const onStateChange = async (state) => {
    const playStatusRef = ref(db, `rooms/${roomId}/playStatus`)
    if (state === 'playing') {
      setPlaying(true)
      set(playStatusRef, true)
    } else if (state === 'paused' || state === 'ended') {
      setPlaying(false)
      set(playStatusRef, false)
    }
  }

  useEffect(() => {
    const getVideoId = (url) => {
      const urlParts = url.split(/[?&]/)
      let id = ''
      urlParts.forEach((part) => {
        if (part.startsWith('v=')) {
          id = part.replace('v=', '')
        }
      })
      return id
    }

    const id = getVideoId(videoUrl)
    setVideoId(id)
  }, [videoUrl])


  return (
    <View>
      <View style={{alignSelf:'center', justifyContent:'center'}}>
      <YoutubePlayer
        ref={playerRef}
        height={windowHeight}
        width={windowWidth}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
      </View>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => setVideoUrl(text)}
        value={videoUrl}
      />
    </View>
  )
}
