import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../components/Store'
import { ref, onValue, off, set, remove } from 'firebase/database'
import { auth, database } from '../firebaseConfig'
import UserList from '../components/UserList/UserListViewer'
import Message from '../components/Message/RoomMessage'
import { Drawer } from '../components/Drawer/DrawerViewer'
import { colorPalette, styles } from '../components/Style'
import * as Clipboard from 'expo-clipboard'
import { Ionicons } from '@expo/vector-icons'

export default function Viewer({ navigation }) {
  const roomId = useSelector((state: RootState) => state.roomId)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen)
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(roomId)
  }

  useEffect(() => {
    if (roomId && auth.currentUser) {
      const viewerRef = ref(database, `rooms/${roomId}/users/${auth.currentUser.uid}`)
      set(viewerRef, true)

      return () => {
        set(viewerRef, false)
      }
    }
  }, [roomId])

  useEffect(() => {
    const usersRef = ref(database, `rooms/${roomId}/users`)
    const checkUserPresence = (snapshot) => {
      if (!snapshot.hasChild(auth.currentUser.uid)) {
        navigation.navigate('Join')
      }
    }

    onValue(usersRef, checkUserPresence)

    return () => {
      off(usersRef, 'value', checkUserPresence)
    }
  }, [roomId])

  return (
    <View style={styles.View3}>
      <TouchableOpacity onPress={toggleDrawer}>
        <UserList />
      </TouchableOpacity>
{//<ViewerPlayer />
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
