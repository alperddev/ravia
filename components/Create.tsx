import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { auth, firestore } from '../firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { styles } from './Style'

export default function CreateRoom({ navigation }) {
  const dispatch = useDispatch()

  const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 5)
  }

  const createRoom = () => {
    const newRoomId = generateUniqueID()
    dispatch({ type: 'SET_ROOMID', roomId: newRoomId })

    const roomRef = doc(
      firestore,
      `users/${auth.currentUser.uid}/rooms/${newRoomId}`
    )
    const roomRefGeneral = doc(firestore, `playRooms/${newRoomId}`)

    setDoc(roomRef, {
      Password: '',
    })
    setDoc(roomRefGeneral, {
      Name: newRoomId,
      Password: '',
      Users: [auth.currentUser.uid],
      Admins: [auth.currentUser.uid],
    })
    navigation.navigate('Admin')
  }
  return (
    <View>
      <TouchableOpacity onPress={createRoom} style={styles.Button}>
        <Text style={styles.ButtonText}>Oda Olustur</Text>
      </TouchableOpacity>
    </View>
  )
}
