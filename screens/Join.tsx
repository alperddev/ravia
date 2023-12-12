import React, { useEffect, useState } from 'react'
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { auth, database, firestore } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore'
import { get, ref, set } from 'firebase/database'
import { styles } from '../components/Style'

export default function Join({ navigation }) {
  const [getRoomId, setGetRoomId] = useState('')
  const [password, setPassword] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchPP = async () => {
      const docSnap = await getDoc(doc(firestore, `users/${auth.currentUser?.uid}`))
      setImageUrl(docSnap.data().pp)
    }

    fetchPP()
  }, [])

  const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 5)
  }

  const createRoom = () => {
    const newRoomId = generateUniqueID()
    dispatch({ type: 'SET_ROOMID', roomId: newRoomId })
    
    const roomRef = doc(firestore, `users/${auth.currentUser.uid}/rooms/${newRoomId}`);
  
    setDoc(roomRef,{
      Users:auth.currentUser.uid,
      Admins:auth.currentUser.uid,

    });
    navigation.navigate('Admin')
  }
  const joinRoom = async () => {
    if (getRoomId === '') {
      Alert.alert('Hata', 'Oda kodu girilmedi')
      return
    }
    const roomRef = ref(database, `rooms/${getRoomId}`)
    const snapshot = await get(roomRef)

    if (snapshot.exists()) {
      const roomPassword = snapshot.val().password
      const bannedUsers = snapshot.val().banned || {}
      if (bannedUsers[auth.currentUser.uid]) {
        Alert.alert('Hata', 'Bu odadan engellendiniz.')
      } else if (roomPassword && roomPassword !== password) {
        Alert.alert('Hata', 'Sifre gecersiz.')
      } else {
        dispatch({ type: 'SET_ROOMID', roomId: getRoomId })
        const roomRef = doc(firestore, `users/${auth.currentUser.uid}/rooms/${getRoomId}`);
        setDoc(roomRef,{
          Users:auth.currentUser.uid,    
        });
        const viewerRef = ref(
          database,
          `rooms/${getRoomId}/users/${auth.currentUser.uid}`
        )
        set(viewerRef, true)
        navigation.navigate('Viewer')
      }
    } else {
      Alert.alert('Hata', 'Oda kodu gecersiz')
    }
  }

  return (
    <SafeAreaView style={styles.View}>
      <View style={styles.View2}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: imageUrl }} style={styles.pp} />
        </TouchableOpacity>
      </View>
      <View style={styles.View}>
        <TouchableOpacity onPress={createRoom} style={styles.Button}>
          <Text style={styles.ButtonText}>Oda Olustur</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.TextInput}
          placeholder="Oda Kodu"
          onChangeText={(text) => setGetRoomId(text)}
          value={getRoomId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Sifre (Sifre yoksa bos birakin)"
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={joinRoom} style={styles.Button2}>
          <Text style={styles.ButtonText2}>Odaya Katil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Chats')} style={styles.Button2}>
          <Text style={styles.ButtonText2}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Rooms')} style={styles.Button2}>
          <Text style={styles.ButtonText2}>Rooms</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
