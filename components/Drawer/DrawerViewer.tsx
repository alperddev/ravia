import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import { get, ref } from 'firebase/database'
import { auth, database, firestore } from '../../firebaseConfig'
import {  doc, getDoc,  } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { RootState } from '../Store'
import { styles } from '../Style'
import { UserOptions } from '../UserOptions/UserOptionsViewer'

export const Drawer = ({ isOpen, toggleDrawer }) => {
  const [users, setUsers] = useState([])
  const [photoURL, setPhotoURL] = useState([])
  const [usernames, setUsernames] = useState([])
  const roomId = useSelector((state: RootState) => state.roomId)

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = ref(database, `rooms/${roomId}/users`)
      const usersSnapshot = await get(usersRef)
      const users = usersSnapshot.val() || {}

      const fetchedUsers = []
      const fetchedPhotoURLs = []
      const fetchedUsernames = []

      for (const userId in users) {
        const userDoc = await getDoc(doc(firestore, `users/${userId}`))
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


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function handleUserPress(user) {
    if (user === auth.currentUser.uid) {
      return;
    }

    setSelectedUser(user);
    setModalVisible(true);
  }
    

  return (
    <View style={[styles.drawer, isOpen ? styles.open : styles.closed]}>
      <TouchableOpacity
        style={[styles.drawer3, isOpen ? styles.open : styles.closed]}
        onPress={toggleDrawer}
      />

      <View style={[styles.drawer2, isOpen ? styles.open : styles.closed]}>
        {users.map(
          (user, index) =>
            photoURL[index] && (
              <View key={index} style={{ paddingBottom: 10 }}>
                                <TouchableOpacity onPress={() => handleUserPress(user)}>

                <View style={styles.View4}>
                  <Image source={{ uri: photoURL[index] }} style={styles.pp3} />
                  <Text style={styles.Text5}>{usernames[index]}</Text>
                </View>
                </TouchableOpacity>
              </View>
            )
        )}
      </View>
      <UserOptions
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      selectedUser={selectedUser}
    />
    </View>
  )
}
