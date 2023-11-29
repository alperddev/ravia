import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import { get, ref } from 'firebase/database'
import { db, fs } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { RootState } from '../app/Store'
import { styles } from './Style'
export const DrawerViewer = ({ isOpen, toggleDrawer }) => {
  const [users, setUsers] = useState([])
  const [photoURL, setPhotoURL] = useState([])
  const [usernames, setUsernames] = useState([])
  const roomId = useSelector((state: RootState) => state.roomId)

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = ref(db, `rooms/${roomId}/users`)
      const usersSnapshot = await get(usersRef)
      const users = usersSnapshot.val() || {}

      const fetchedUsers = []
      const fetchedPhotoURLs = []
      const fetchedUsernames = []

      for (const userId in users) {
        const userDoc = await getDoc(doc(fs, `users/${userId}`))
        const pp = userDoc.data().pp
        const username = userDoc.data().username

        fetchedUsers.push(userId)
        fetchedPhotoURLs.push(pp && typeof pp === 'string' ? pp : null)
        fetchedUsernames.push(
          username && typeof username === 'string' ? username : null
        )
      }

      setUsers(fetchedUsers)
      setPhotoURL(fetchedPhotoURLs)
      setUsernames(fetchedUsernames)
    }

    fetchUsers()
  }, [roomId, users])

  return (
    <View style={[styles.drawer, isOpen ? styles.open : styles.closed]}>
      <View
        style={[styles.drawer3, isOpen ? styles.open : styles.closed]}
        onTouchStart={toggleDrawer}
      />

      <View style={[styles.drawer2, isOpen ? styles.open : styles.closed]}>
        {users.map(
          (user, index) =>
            photoURL[index] && (
              <View key={index} style={{ paddingBottom: 10 }}>
                <View style={styles.View4}>
                  <Image source={{ uri: photoURL[index] }} style={styles.pp3} />
                  <Text style={styles.Text5}>{usernames[index]}</Text>
                </View>
              </View>
            )
        )}
      </View>
    </View>
  )
}
