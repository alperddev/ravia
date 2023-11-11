import React, { useEffect, useState } from 'react'
import { View, Button, TextInput, StyleSheet, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import { auth } from '../firebaseConfig'
import { NavigationProp } from '@react-navigation/native'
import { User, onAuthStateChanged } from 'firebase/auth'
interface RouterProps {
  navigation: NavigationProp<any, any>
}
export default function Join({ navigation }: RouterProps) {
  const [user, setUser] = useState<User | null>(null)

  const [getRoomId, setGetRoomId] = useState('')
  const dispatch = useDispatch()
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
    auth
      .signOut()
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          setUser(null)
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
  return (
    <View style={{ flex: 1 }}>
      <Button title="Create Room" onPress={createRoom} />
      <Button title="Join Room" onPress={joinRoom} />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => setGetRoomId(text)}
        value={getRoomId}
        placeholder="Enter room ID"
      />
      <View >
        <Text>Email: {auth.currentUser?.email}</Text>
        <Text>Email: {auth.currentUser?.uid }</Text>

        <Button title="Sign Out" onPress={SignOut} />
      </View>
    </View>
  )
}

