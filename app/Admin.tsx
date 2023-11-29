import React, { useEffect, useState } from 'react'
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native'
import { ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'
import { RootState } from './Store'
import { auth, db } from '../firebaseConfig'
import UserList from '../components/UserListAdmin'
import Message from '../components/Message'
import AdminPlayer from '../components/PlayerAdmin'
import { AdminDrawer } from '../components/DrawerAdmin'
import { colorPalette, styles } from '../components/Style'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'

export default function Admin() {
  const roomId = useSelector((state: RootState) => state.roomId)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen)
  }

  useEffect(() => {
    if (roomId && auth.currentUser) {
      const usersRef = ref(db, `rooms/${roomId}/users/${auth.currentUser.uid}`)
      set(usersRef, true)

      return () => {
        const roomRef = ref(db, `rooms/${roomId}`)
        remove(roomRef)
      }
    }
  }, [roomId])

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(roomId)
  }

  return (
    <View style={styles.View3}>
      <TouchableOpacity onPress={toggleDrawer}>
        <UserList />
      </TouchableOpacity>

      <AdminPlayer />

      <Message />
      <TouchableOpacity onPress={copyToClipboard}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={styles.Text2}>Oda Kodu: {roomId}</Text>

          <Ionicons
            style={{ marginLeft: 10 }}
            name="copy"
            size={30}
            color={colorPalette.white}
          />
        </View>
      </TouchableOpacity>
      <AdminDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </View>
  )
}
