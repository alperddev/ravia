import React, { useEffect, useState } from 'react'
import {
  View,
  Button,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { auth } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

export default function Join({ navigation }) {
  const [getRoomId, setGetRoomId] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    const storage = getStorage()
    const gsReference = ref(storage, auth.currentUser?.photoURL)

    getDownloadURL(gsReference)
      .then((url) => {
        setImageUrl(url)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [imageUrl])

  const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 3)
  }

  const createRoom = () => {
    const newRoomId = generateUniqueID()
    const newUserId = generateUniqueID()
    dispatch({ type: 'SET_ROOMID', roomId: newRoomId })
    dispatch({ type: 'SET_USERID', userId: newUserId })
    navigation.navigate('Admin')
  }

  const joinRoom = () => {
    const newUserId = generateUniqueID()
    dispatch({ type: 'SET_ROOMID', roomId: getRoomId })
    dispatch({ type: 'SET_USERID', userId: newUserId })
    navigation.navigate('Viewer')
  }

  const SignOut = () => {
    auth.signOut().catch((error) => {
      console.error(error)
    })
  }

  return (
    <SafeAreaView>
      <Button title="Create Room" onPress={createRoom} />
      <Button title="Join Room" onPress={joinRoom} />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => setGetRoomId(text)}
        value={getRoomId}
        placeholder="Enter room ID"
      />
      <View>
        <Text>Email: {auth.currentUser?.email}</Text>
        <Text>Username: {auth.currentUser?.displayName}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: imageUrl }} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <Button title="Sign Out" onPress={SignOut} />
      </View>
    </SafeAreaView>
  )
}
