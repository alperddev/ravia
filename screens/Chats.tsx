import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native'
import { auth, firestore } from '../firebaseConfig'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { styles } from '../components/Style'
import { UserOptions } from '../components/UserOptions/UserOptionsChats'
import { FontAwesome } from '@expo/vector-icons'

export default function Chats({ navigation }) {
  const [friends, setFriends] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [chatRoomId, setChatRoomId] = useState(null)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  useEffect(() => {
    fetchFriends()
  }, [])
  async function fetchFriends() {
    setLoading(true)
    const friendsRef = collection(
      firestore,
      `users/${auth.currentUser.uid}/friends`
    )

    const friendsSnap = await getDocs(friendsRef)

    const friendsList = []

    for (const friendDoc of friendsSnap.docs) {
      const friendId = friendDoc.id
      const friendUserRef = doc(firestore, `users/${friendId}`)
      const friendUserSnap = await getDoc(friendUserRef)
      const chatRoomRef = doc(
        firestore,
        `users/${friendId}/friends/${auth.currentUser.uid}`
      )
      const chatRoomSnap = await getDoc(chatRoomRef)

      if (friendUserSnap.exists()) {
        friendsList.push({
          id: friendId,
          chatRoomId: chatRoomSnap.data().chatRoomId,
          ...friendUserSnap.data(),
        })
      }
    }

    setFriends(friendsList)
    setLoading(false)
  }
  function handleUserPress(user) {
    dispatch({ type: 'SET_CHATID', chatId: user.chatRoomId })
    dispatch({ type: 'SET_FRIENDID', friendId: user.id })

    navigation.navigate('Chat')
  }

  function handleLongUserPress(user) {
    setChatRoomId(user.chatRoomId)
    setSelectedUser(user.id)
    setModalVisible(true)
  }

  return (
    <View style={[styles.View, { paddingTop: 40 }]}>
      <TouchableOpacity style={{ paddingBottom: 20 }} onPress={fetchFriends}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FontAwesome name="refresh" size={24} color="white" />
        )}
      </TouchableOpacity>
      <ScrollView>
        {friends.length > 0 ? (
          friends.map(
            (user, index) =>
              user.pp && (
                <View key={index} style={{ paddingBottom: 10 }}>
                  <TouchableOpacity
                    onPress={() => handleUserPress(user)}
                    onLongPress={() => handleLongUserPress(user)}
                  >
                    <View style={styles.View4}>
                      <Image source={{ uri: user.pp }} style={styles.pp3} />
                      <Text style={styles.Text5}>{user.username}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
          )
        ) : (
          <Text style={styles.Text5}>Arkadaş eklemek için bir odaya katıl</Text>
        )}
      </ScrollView>
      <UserOptions
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedUser={selectedUser}
        chatRoomId={chatRoomId}
      />
    </View>
  )
}
