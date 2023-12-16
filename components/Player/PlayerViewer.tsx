import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions } from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'
import { useSelector } from 'react-redux'
import { RootState } from '../Store'
import { onValue, ref } from 'firebase/database'
import { database } from '../../firebaseConfig'
import { styles } from '../Style'
export default function ViewerPlayer() {
  const playerRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentTimeDB, setCurrentTimeDB] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [videoId, setVideoId] = useState('')
  const roomId = useSelector((state: RootState) => state.roomId)
  const windowWidth = Dimensions.get('window').width - 5
  const windowHeight = windowWidth * (9 / 16)

  const [isVideoIdValid, setVideoIdValid] = useState(false)

  useEffect(() => {
    if (!videoId) {
      setVideoIdValid(true)
    } else {
      setVideoIdValid(false)
    }
  }, [videoId])

  useEffect(() => {
    if (Number(Math.abs(currentTimeDB - currentTime)) > Number(2)) {
      playerRef.current.seekTo(currentTimeDB, true)
    }
  })

  useEffect(() => {
    const currentTimeRef = ref(database, `rooms/${roomId}/currentTime`)
    const playStatusRef = ref(database, `rooms/${roomId}/playStatus`)
    const videoIdRef = ref(database, `rooms/${roomId}/videoId`)
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
    <View
      style={{
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
      }}
    >
      <View
        style={[
          { height: windowHeight, width: windowWidth },
          styles.video0,
          isVideoIdValid ? styles.open : styles.closed,
        ]}
      >
        <Text style={styles.Text4}>Video Bekleniyor</Text>
      </View>

      <YoutubePlayer
        ref={playerRef}
        height={windowHeight}
        width={windowWidth}
        play={playing}
        videoId={videoId}
      />
    </View>
  )
}