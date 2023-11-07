import React, { useState } from 'react'
import { View, Button, TextInput } from 'react-native'
import { FIREBASE_DB } from '../firebaseConfig'
import { ref, set } from 'firebase/database'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './Store'

export default function Join({ navigation }) {
  const [getRoomId, setGetRoomId] = useState('')
  const roomId = useSelector((state: RootState) => state.roomId)
  const userId = useSelector((state: RootState) => state.userId)
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
    </View>
  )
}
