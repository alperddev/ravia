import React, { useState, useEffect } from 'react'
import { View, Image } from 'react-native'
import { onValue, ref } from 'firebase/database'
import { database, firestore } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { RootState } from '../Store'
import { styles } from '../Style'
export default function UserList() {
  const [users, setUsers] = useState([])
  const [photoURL, setPhotoURL] = useState([])
  const roomId = useSelector((state: RootState) => state.roomId)
  useEffect(() => {
    const usersRef = ref(database, `rooms/${roomId}/users`)

    const unsubscribe = onValue(usersRef, async (snapshot) => {
      const users = snapshot.val() || {}
      const fetchedUsers = []
      const fetchedPhotoURLs = []

      for (const userId in users) {
        if (users[userId] === false) continue

        const userDoc = await getDoc(doc(firestore, `users/${userId}`))
        const pp = userDoc.data().pp

        fetchedUsers.push(userId)
        fetchedPhotoURLs.push(pp && typeof pp === 'string' ? pp : null)
      }

      setUsers(fetchedUsers)
      setPhotoURL(fetchedPhotoURLs)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <View style={{ flexDirection: 'row', paddingTop: 30, paddingLeft: 10 }}>
      <View
        style={{ position: 'absolute', zIndex: 1, right: 10, paddingTop: 35 }}
      ></View>
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
