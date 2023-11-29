import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Alert,
} from 'react-native'
import { get, ref, remove, set } from 'firebase/database'
import { auth, db, fs } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { RootState } from '../app/Store'
import { colorPalette, styles } from './Style'
export const AdminDrawer = ({ isOpen, toggleDrawer }) => {
  const [users, setUsers] = useState([])
  const [photoURL, setPhotoURL] = useState([])
  const [usernames, setUsernames] = useState([])
  const roomId = useSelector((state: RootState) => state.roomId)
  const [password, setPassword] = useState('')

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

  function kickUser(user) {
    const userRef = ref(db, `rooms/${roomId}/users/${user}`)
    remove(userRef)
  }

  function kickAndBanUser(user) {
    const userRef = ref(db, `rooms/${roomId}/users/${user}`)
    remove(userRef)

    const bannedUserRef = ref(db, `rooms/${roomId}/banned/${user}`)
    set(bannedUserRef, true)
  }
  function handleUserPress(user) {
    if (user === auth.currentUser.uid) {
      return
    }

    Alert.alert('', 'Kullanici Secenekleri', [
      {
        text: 'Geri',
        style: 'cancel',
      },
      {
        text: 'Odadan At',
        onPress: () => kickUser(user),
      },
      {
        text: 'Odadan At ve engelle',
        onPress: () => kickAndBanUser(user),
      },
    ])
  }

  function handlePassword() {
    if (roomId && auth.currentUser) {
      const passwordRef = ref(db, `rooms/${roomId}/password`)
      set(passwordRef, password)
    }
  }

  return (
    <View style={[styles.drawer, isOpen ? styles.open : styles.closed]}>
      <View
        style={[styles.drawer3, isOpen ? styles.open : styles.closed]}
        onTouchStart={toggleDrawer}
      />

      <ScrollView
        style={[styles.drawer2, isOpen ? styles.open : styles.closed]}
      >
        {users.map(
          (user, index) =>
            photoURL[index] && (
              <View key={index} style={{ paddingBottom: 10 }}>
                <TouchableOpacity onPress={() => handleUserPress(user)}>
                  <View style={styles.View4}>
                    <Image
                      source={{ uri: photoURL[index] }}
                      style={styles.pp3}
                    />
                    <Text style={styles.Text5}>{usernames[index]}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
        )}
        <TextInput
          style={styles.TextInput4}
          value={password}
          onChangeText={setPassword}
          placeholder="Sifre"
          placeholderTextColor={colorPalette.purple}
        />
        <TouchableOpacity style={styles.Button3} onPress={handlePassword}>
          <Text style={styles.ButtonText}>Sifre ayarla</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
