import React, { useEffect, useState } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { auth, database, firestore } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore'
import { get, ref, set } from 'firebase/database'
import { styles } from '../components/Style'

export default function Rooms({ navigation }) {
  const [rooms, setRooms] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsRef = collection(
        firestore,
        `users/${auth.currentUser.uid}/rooms`
      )
      const roomsSnap = await getDocs(roomsRef)

      const roomsList = roomsSnap.docs.map((doc) => ({
        id: doc.id,
      }))

      setRooms(roomsList)
    }

    fetchRooms()
  }, [])

  const joinRoom = async (roomId) => {
    if (roomId === '') {
      Alert.alert('Hata', 'Oda kodu girilmedi')
      return
    }
    const roomRef = ref(database, `rooms/${roomId}`)
    const snapshot = await get(roomRef)

    if (snapshot.exists()) {
      const bannedUsers = snapshot.val().banned || {}
      if (bannedUsers[auth.currentUser.uid]) {
        Alert.alert('Hata', 'Bu odadan engellendiniz.')
      } else {
        dispatch({ type: 'SET_ROOMID', roomId })
        const userRoomRef = doc(
          firestore,
          `users/${auth.currentUser.uid}/rooms/${roomId}`
        )
        const userRoomSnap = await getDoc(userRoomRef)
        if (
          userRoomSnap.exists() &&
          userRoomSnap.data().Admins === auth.currentUser.uid
        ) {
          navigation.navigate('Admin')
        } else {
          await setDoc(userRoomRef, { Users: auth.currentUser.uid })
          const viewerRef = ref(
            database,
            `rooms/${roomId}/users/${auth.currentUser.uid}`
          )
          await set(viewerRef, false)
          navigation.navigate('Viewer')
        }
      }
    } else {
      Alert.alert('Hata', 'Oda kodu gecersiz')
    }
  }

  return (
    <SafeAreaView style={styles.View}>
      <View style={styles.View}>
        <ScrollView>
          {rooms.map((room, index) => (
            <View key={index} style={{ paddingBottom: 10 }}>
              <TouchableOpacity onPress={() => joinRoom(room.id)}>
                <View style={styles.View4}>
                  <Text style={styles.Text5}>{room.id}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
