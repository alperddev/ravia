import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../app/Store'
import { onValue, push, ref, set } from 'firebase/database'
import { auth, db, fs } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { styles, colorPalette } from './Style'
import { Ionicons } from '@expo/vector-icons'

export default function Message() {
  const [imageUrl, setImageUrl] = useState(null)

  const username = auth.currentUser?.displayName

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const roomId = useSelector((state: RootState) => state.roomId)

  useEffect(() => {
    if (roomId) {
      const messagesRef = ref(db, `rooms/${roomId}/messages`)
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const items = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setMessages(items)
        }
      })
      return () => unsubscribe()
    }
  }, [roomId])

  const sendMessage = () => {
    if (roomId && newMessage) {
      const messagesRef = ref(db, `rooms/${roomId}/messages`)
      const newMessageRef = push(messagesRef)
      set(newMessageRef, {
        text: newMessage,
        username: username,
        photoURL: imageUrl,
      })
      setNewMessage('')
    }
  }
  useEffect(() => {
    const fetchPP = async () => {
      const docSnap = await getDoc(doc(fs, `users/${auth.currentUser?.uid}`))
      setImageUrl(docSnap.data().pp)
    }

    fetchPP()
  }, [])

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 20,
              paddingLeft: 10,
            }}
          >
            <Image source={{ uri: item.photoURL }} style={styles.pp2}></Image>
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ color: colorPalette.pink }}>{item.username}</Text>
              <Text style={{ color: colorPalette.white, marginRight: 60 }}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />
      <View
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
      </View>
    </View>
  )
}
