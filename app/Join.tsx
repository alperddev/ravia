import React, { useEffect, useState } from 'react'
import {
  View,
  Button,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { auth, db, fs } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, getDoc } from 'firebase/firestore'
import { get, ref } from 'firebase/database'

export default function Join({ navigation }) {
  const [getRoomId, setGetRoomId] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchPP = async () => {
      const docSnap = await getDoc(doc(fs, `users/${auth.currentUser?.uid}`))
      setImageUrl(docSnap.data().pp)
    }

    fetchPP()
  }, [])

  const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 3)
  }

  const createRoom = () => {
    const newRoomId = generateUniqueID()
    dispatch({ type: 'SET_ROOMID', roomId: newRoomId })
    navigation.navigate('Admin')
  }

 
const joinRoom = async () => {
  const roomRef = ref(db, `rooms/${getRoomId}`)
  const snapshot = await get(roomRef)

  if (snapshot.exists()) {
    dispatch({ type: 'SET_ROOMID', roomId: getRoomId })
    navigation.navigate('Viewer')
  } else {
    Alert.alert('Error', 'The room does not exist.')
  }
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
