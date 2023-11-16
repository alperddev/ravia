import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'
import { useSelector } from 'react-redux'
import { RootState } from './Store'
import { get, onValue, push, ref, set } from 'firebase/database'
import { auth, db } from '../firebaseConfig'
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'
export default function Viewer() {
  const [users, setUsers] = useState([])

  const [imageUrl, setImageUrl] = useState(null)

  const username = auth.currentUser?.displayName

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const playerRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentTimeDB, setCurrentTimeDB] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [videoId, setVideoId] = useState('')
  const roomId = useSelector((state: RootState) => state.roomId)

  useEffect(() => {
    if (roomId && auth.currentUser) {
      const viewerRef = ref(
        db,
        `rooms/${roomId}/users/viewers/${auth.currentUser.uid}`
      )
      set(viewerRef, true)
    }
  }, [roomId])

  useEffect(() => {
    if (roomId) {
      const adminsRef = ref(db, `rooms/${roomId}/users/admins`)
      const viewersRef = ref(db, `rooms/${roomId}/users/viewers`)

      const fetchUsers = async () => {
        const adminsSnapshot = await get(adminsRef)
        const viewersSnapshot = await get(viewersRef)

        const admins = adminsSnapshot.val() || {}
        const viewers = viewersSnapshot.val() || {}

        console.log('Admins:', admins)
        console.log('Viewers:', viewers)

        const users = [...Object.values(admins), ...Object.values(viewers)]
        console.log('Users:', users)
        setUsers(users)
      }

      fetchUsers()
    }
  }, [roomId])

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

  useEffect(() => {
    if (roomId) {
      const messagesRef = ref(db, `rooms/${roomId}/messages`)
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const items = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setMessages(items)
        }
      })
      return () => unsubscribe()
    }
  }, [roomId])

  const sendMessage = () => {
    if (roomId && newMessage) {
      const messagesRef = ref(db, `rooms/${roomId}/messages`)
      const newMessageRef = push(messagesRef)
      set(newMessageRef, {
        text: newMessage,
        username: username,
        photoURL: imageUrl,
      })
      setNewMessage('')
    }
  }
  useEffect(() => {
    const storage = getStorage()
    const gsReference = storageRef(storage, auth.currentUser?.photoURL)

    getDownloadURL(gsReference)
      .then((url) => {
        setImageUrl(url)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        {users.map((user, index) => (
          <ImageBackground
            key={index}
            source={{ uri: user.photoURL }}
            style={{ width: 50, height: 50 }}
          />
        ))}
      </View>
      <YoutubePlayer
        ref={playerRef}
        height={300}
        play={playing}
        videoId={videoId}
      />
      <Text>{roomId}</Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginLeft: 10 }}>
                <ImageBackground
                  source={{ uri: item.photoURL }}
                  style={{ width: 50, height: 50 }}
                ></ImageBackground>
                <Text>{item.username}</Text>
                <Text>{item.text}</Text>
              </View>
            </View>
          )}
        />

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
        />
        <Button title="Send Message" onPress={sendMessage} />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginLeft: 10 }}>
                <ImageBackground
                  source={{ uri: item.photoURL }}
                  style={{ width: 50, height: 50 }}
                ></ImageBackground>
                <Text>{item.username}</Text>
                <Text>{item.text}</Text>
              </View>
            </View>
          )}
        />

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
        />
        <Button title="Send Message" onPress={sendMessage} />
      </View>
    </View>
  )
}
