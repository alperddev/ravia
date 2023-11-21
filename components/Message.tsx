import React, { useState, useEffect} from 'react'
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../app/Store'
import {onValue, push, ref, set } from 'firebase/database'
import { auth, db, fs } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
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
    <View >


        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginLeft: 10 }}>
                <ImageBackground
                  source={{ uri: item.photoURL }}
                  style={{ width: 50, height: 50 }}
                ></ImageBackground>
                <Text>{item.username}</Text>
                <Text>{item.text}</Text>
              </View>
            </View>
          )}
        />

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
        />
        <Button title="Send Message" onPress={sendMessage} />
      </View>
  )
}
