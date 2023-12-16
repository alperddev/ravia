import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { auth, database, firestore } from '../firebaseConfig'
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore'
import { get, ref, set } from 'firebase/database'
import { styles } from '../components/Style'

export default function JoinRoom({ navigation }) {
  const [getRoomId, setGetRoomId] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const joinRoom = async () => {
    if (getRoomId === '') {
      Alert.alert('Hata', 'Oda kodu girilmedi')
      return
    }
    const roomRef = ref(database, `rooms/${getRoomId}`)
    const snapshot = await get(roomRef)

    if (snapshot.exists()) {
      const roomPassword = snapshot.val().password
      const bannedUsers = snapshot.val().banned || {}
      if (bannedUsers[auth.currentUser.uid]) {
        Alert.alert('Hata', 'Bu odadan engellendiniz.')
      } else if (roomPassword && roomPassword !== password) {
        Alert.alert('Hata', 'Sifre gecersiz.')
      } else {
        dispatch({ type: 'SET_ROOMID', roomId: getRoomId })
        const roomRef = doc(
          firestore,
          `users/${auth.currentUser.uid}/rooms/${getRoomId}`
        )
        const roomRefGeneral = doc(firestore, `playRooms/${getRoomId}`)

        setDoc(roomRef, {
          Users: auth.currentUser.uid,
        })
        updateDoc(roomRefGeneral, {
          Users: arrayUnion(auth.currentUser.uid),
        })

        const viewerRef = ref(
          database,
          `rooms/${getRoomId}/users/${auth.currentUser.uid}`
        )
        set(viewerRef, true)
        navigation.navigate('Viewer')
      }
    } else {
      Alert.alert('Hata', 'Oda kodu gecersiz')
    }
  }

  return (
    <View>
      <TextInput
        style={styles.TextInput}
        placeholder="Oda Kodu"
        onChangeText={(text) => setGetRoomId(text)}
        value={getRoomId}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.TextInput}
        placeholder="Sifre (Sifre yoksa bos birakin)"
        onChangeText={(text) => setPassword(text)}
        value={password}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={joinRoom} style={styles.Button2}>
        <Text style={styles.ButtonText2}>Odaya Katil</Text>
      </TouchableOpacity>
    </View>
  )
}
