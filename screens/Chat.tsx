import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { auth, firestore } from '../firebaseConfig'
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
} from 'firebase/firestore'
import { styles, colorPalette } from '../components/Style'
import { Ionicons } from '@expo/vector-icons'
import Message from '../components/Message/PrivateMessage'
import { useSelector } from 'react-redux'
import { RootState } from '../components/Store'

export default function Chat() {
  const username = auth.currentUser?.displayName

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const profilePicture = useSelector((state: RootState) => state.profilePicture)

  const roomId = useSelector((state: RootState) => state.chatId)
  const friendId = useSelector((state: RootState) => state.friendId)

  const flatListRef = useRef(null)

  useEffect(() => {
    if (roomId) {
      const messagesRef = collection(
        firestore,
        `chatRooms/${roomId}/${auth.currentUser?.uid}`
      )
      const q = query(messagesRef, orderBy('timestamp'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let items = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        setMessages(items)
        flatListRef.current?.scrollToEnd({ animated: true })
      })
      return () => unsubscribe()
    }
  }, [])

  const sendMessage = async () => {
    setNewMessage('')

    if (roomId && newMessage) {
      const currentUserMessagesRef = collection(
        firestore,
        `chatRooms/${roomId}/${auth.currentUser?.uid}`
      )
      const friendMessagesRef = collection(
        firestore,
        `chatRooms/${roomId}/${friendId}`
      )

      const message = {
        text: newMessage,
        username: username,
        photoURL: profilePicture,
        timestamp: Date.now(),
      }

      await addDoc(currentUserMessagesRef, message)
      await addDoc(friendMessagesRef, message)
    }
  }

  return (
    <View
      style={{ flex: 1, paddingTop: 20, backgroundColor: colorPalette.black }}
    >
      <ScrollView style={{ height: 100, flexDirection: 'column-reverse' }}>
        <Message messages={messages} username={username} />
      </ScrollView>

      <KeyboardAvoidingView
        style={{
          alignSelf: 'center',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        <TextInput
          style={styles.TextInput2}
          placeholder="..."
          placeholderTextColor={colorPalette.white}
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            paddingRight: 10,
            paddingBottom: 20,
          }}
          onPress={sendMessage}
        >
          <Ionicons name="ios-send" size={30} color={colorPalette.purple} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}
