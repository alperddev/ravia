import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { auth, database, firestore } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
} from 'firebase/firestore'
import { get, ref, set } from 'firebase/database'
import { colorPalette, styles } from './Style'
import { FontAwesome } from '@expo/vector-icons'
import { RoomOptions } from './RoomOptions'
export default function Rooms({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [roomId, setRoomId] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    fetchRooms()
  }, [])
  const fetchRooms = async () => {
    setLoading(true)
    const roomsRef = collection(
      firestore,
      `users/${auth.currentUser.uid}/rooms`
    )
    const roomsSnap = await getDocs(roomsRef)

    const roomsList = []
    for (let docc of roomsSnap.docs) {
      const roomId = docc.id
      const roomRefGeneral = doc(firestore, `playRooms/${roomId}`)
      const roomGeneralSnap = await getDoc(roomRefGeneral)
      if (roomGeneralSnap.exists()) {
        roomsList.push({
          id: roomId,
          name: roomGeneralSnap.data().Name,
        })
      }
    }

    setRooms(roomsList)
    setLoading(false)
  }

  const joinRoom = async (roomId) => {
    const roomRef = ref(database, `rooms/${roomId}`)
    const snapshot = await get(roomRef)

    if (snapshot.exists()) {
      const bannedUsers = snapshot.val().banned || {}
      if (bannedUsers[auth.currentUser.uid]) {
        Alert.alert('Hata', 'Bu odadan engellendiniz.')
      } else {
        dispatch({ type: 'SET_ROOMID', roomId })
        const roomRefGeneral = doc(firestore, `playRooms/${roomId}`)
        const roomGeneralSnap = await getDoc(roomRefGeneral)
        if (
          roomGeneralSnap.exists() &&
          roomGeneralSnap.data().Admins.includes(auth.currentUser.uid)
        ) {
          const viewerRef = ref(
            database,
            `rooms/${roomId}/users/${auth.currentUser.uid}`
          )
          await set(viewerRef, true)
          navigation.navigate('Admin')
        } else {
          const viewerRef = ref(
            database,
            `rooms/${roomId}/users/${auth.currentUser.uid}`
          )
          await set(viewerRef, true)
          navigation.navigate('Viewer')
        }
      }
    } else {
      Alert.alert('Hata', 'Oda kodu gecersiz')
    }
  }
  const handleLongPress = (roomId) => {
    setModalVisible(true)
    setRoomId(roomId)
  }
  return (
    <SafeAreaView style={styles.View}>
      <View style={styles.View}>
        <TouchableOpacity style={{ paddingBottom: 20 }} onPress={fetchRooms}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FontAwesome name="refresh" size={24} color="white" />
          )}
        </TouchableOpacity>
        <ScrollView>
          {rooms.length === 0 ? (
            <Text style={styles.Text5}>
              Oda eklemek veya katılmak için lütfen + butonuna tıklayın
            </Text>
          ) : (
            rooms.map((room, index) => (
              <View key={index} style={{ paddingBottom: 10 }}>
                <TouchableOpacity
                  onPress={() => joinRoom(room.id)}
                  onLongPress={() => handleLongPress(room.id)}
                >
                  <View style={styles.View4}>
                    <Text style={styles.Text5}>{room.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
          <RoomOptions
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            roomId={roomId}
            fetchRooms={fetchRooms}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
