import React, { useState, useRef, useEffect } from 'react'
import { View, TextInput, Dimensions, Text } from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'
import { ref, set } from 'firebase/database'
import { useSelector } from 'react-redux'
import { RootState } from '../Store'
import { database } from '../../firebaseConfig'
import { styles } from '../Style'

export default function AdminPlayer() {
  const roomId = useSelector((state: RootState) => state.roomId)
  const playerRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')
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
    const currentTimeRef = ref(database, `rooms/${roomId}/currentTime`)
    let interval

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
    const videoIdRef = ref(database, `rooms/${roomId}/videoId`)
    set(videoIdRef, videoId)
  }, [roomId, videoId])

  const onStateChange = async (state) => {
    const playStatusRef = ref(database, `rooms/${roomId}/playStatus`)
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
      const videoIdMatch = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|live\/)|youtu\.be\/)([^"&?\/ ]{11})/i
      )
      return videoIdMatch ? videoIdMatch[1] : ''
    }

    const id = getVideoId(videoUrl)
    setVideoId(id)
  }, [videoUrl])

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
        <Text style={styles.Text4}>
          Video linkini asagidaki kutucuga yapistirin
        </Text>
      </View>

      <YoutubePlayer
        ref={playerRef}
        height={windowHeight}
        width={windowWidth}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />

      <TextInput
        style={styles.TextInput3}
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        onChangeText={(text) => setVideoUrl(text)}
        value={videoUrl}
      />
    </View>
  )
}
