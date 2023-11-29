import React, { useState, useEffect } from 'react'
import { View, Image } from 'react-native'
import { get, ref } from 'firebase/database'
import { db, fs } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { RootState } from '../app/Store'
import { colorPalette, styles } from './Style'
import { MaterialIcons } from '@expo/vector-icons'
export default function UserList() {
  const [users, setUsers] = useState([])
  const [photoURL, setPhotoURL] = useState([])
  const roomId = useSelector((state: RootState) => state.roomId)

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = ref(db, `rooms/${roomId}/users`)
      const usersSnapshot = await get(usersRef)
      const users = usersSnapshot.val() || {}

      const fetchedUsers = []
      const fetchedPhotoURLs = []

      for (const userId in users) {
        const userDoc = await getDoc(doc(fs, `users/${userId}`))
        const pp = userDoc.data().pp

        fetchedUsers.push(userId)
        fetchedPhotoURLs.push(pp && typeof pp === 'string' ? pp : null)
      }

      setUsers(fetchedUsers)
      setPhotoURL(fetchedPhotoURLs)
    }
    fetchUsers()
  }, [roomId, users])

  return (
    <View style={{ flexDirection: 'row', paddingTop: 30, paddingLeft: 10 }}>
      <View
        style={{ position: 'absolute', zIndex: 1, right: 10, paddingTop: 35 }}
      >
        <MaterialIcons name="settings" size={50} color={colorPalette.orange} />
      </View>
      {users.map(
        (user, index) =>
          photoURL[index] && (
            <Image
              key={index}
              source={{ uri: photoURL[index] }}
              style={styles.pp}
            />
          )
      )}
    </View>
  )
}
