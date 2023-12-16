import React, { useEffect, useState } from 'react'
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native'
import { ref, remove, set, onValue } from 'firebase/database'
import { useSelector } from 'react-redux'
import { RootState } from '../components/Store'
import { auth, database, firestore } from '../firebaseConfig'
import UserList from '../components/UserList/UserListAdmin'
import Message from '../components/Message/RoomMessage'
import { Drawer } from '../components/Drawer/DrawerAdmin'
import { colorPalette, styles } from '../components/Style'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'

export default function Admin({ navigation }) {
  const roomId = useSelector((state: RootState) => state.roomId)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen)
  }

  useEffect(() => {
    if (roomId && auth.currentUser) {
      const usersRef = ref(database, `rooms/${roomId}/users`)

      const listener = onValue(usersRef, (snapshot) => {
        const data = snapshot.val()
        if (!data.hasOwnProperty(auth.currentUser.uid)) {
          navigation.navigate('Home')
        }
      })

      return () => {
        listener()
      }
    }
  }, [])
  useEffect(() => {
    if (roomId && auth.currentUser) {
      const usersRef = ref(
        database,
        `rooms/${roomId}/users/${auth.currentUser.uid}`
      )

      set(usersRef, true)

      return () => {
        set(usersRef, false)
      }
    }
  }, [])

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(roomId)
  }

  return (
    <View style={styles.View3}>
      <TouchableOpacity onPress={toggleDrawer}>
        <UserList />
      </TouchableOpacity>
      {
        //<AdminPlayer />
      }
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
      <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </View>
  )
}
