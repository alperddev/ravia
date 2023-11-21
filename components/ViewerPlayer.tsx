import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
} from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'
import { useSelector } from 'react-redux'
import { RootState } from '../app/Store'
import {  onValue, ref} from 'firebase/database'
import { db} from '../firebaseConfig'
export default function ViewerPlayer() {
  const playerRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentTimeDB, setCurrentTimeDB] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [videoId, setVideoId] = useState('')
  const roomId = useSelector((state: RootState) => state.roomId)


  useEffect(() => {
    if (Number(Math.abs(currentTimeDB - currentTime)) > Number(2)) {
      playerRef.current.seekTo(currentTimeDB, true)
    }
  })

  useEffect(() => {
    const currentTimeRef = ref(db, `rooms/${roomId}/currentTime`)
    const playStatusRef = ref(db, `rooms/${roomId}/playStatus`)
    const videoIdRef = ref(db, `rooms/${roomId}/videoId`)
    onValue(currentTimeRef, (snapshot) => {
      setCurrentTimeDB(snapshot.val())
    })

    onValue(playStatusRef, (snapshot) => {
      setPlaying(snapshot.val())
    })

    onValue(videoIdRef, (snapshot) => {
      setVideoId(snapshot.val())
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const time = await playerRef.current.getCurrentTime()
      setCurrentTime(time)
    }, 1000)

    return () => clearInterval(interval)
  }, [playing])

  return (
    <View style={{ flex: 1 }}>
      <YoutubePlayer
        ref={playerRef}
        height={250}
        play={playing}
        videoId={videoId}
      />
                  <TextInput
        editable={false}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={roomId}
      />
    </View>
  )
}
