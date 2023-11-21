import React, { useEffect, useState } from 'react'
import {
  View,
  Button,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { auth, db, fs } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, getDoc } from 'firebase/firestore'
import { get, ref, remove, set } from 'firebase/database'

export default function Join({ navigation }) {
  const [getRoomId, setGetRoomId] = useState('')
  const [password, setPassword] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchPP = async () => {
      const docSnap = await getDoc(doc(fs, `users/${auth.currentUser?.uid}`))
      setImageUrl(docSnap.data().pp)
    }

    fetchPP()
  }, [])

  const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 3)
  }

  const createRoom = () => {
    const newRoomId = generateUniqueID()
    dispatch({ type: 'SET_ROOMID', roomId: newRoomId })
    navigation.navigate('Admin')
  }
  const joinRoom = async () => {
    const roomRef = ref(db, `rooms/${getRoomId}`);
    const snapshot = await get(roomRef);
  
    if (snapshot.exists()) {
      const roomPassword = snapshot.val().password;
      const bannedUsers = snapshot.val().banned || {};
      if (bannedUsers[auth.currentUser.uid]) {
        Alert.alert('Error', 'You are banned from this room.');
      } else if (roomPassword && roomPassword !== password) {
        Alert.alert('Error', 'Incorrect password.');
      } else {
        dispatch({ type: 'SET_ROOMID', roomId: getRoomId });

        const viewerRef = ref(db, `rooms/${getRoomId}/users/${auth.currentUser.uid}`);
        set(viewerRef, false);
        
        navigation.navigate('Viewer');
      }
    } else {
      Alert.alert('Error', 'The room does not exist.');
    }
  };
  
  useEffect(() => {
    return () => {
      if (getRoomId && auth.currentUser) {
        const viewerRef = ref(db, `rooms/${getRoomId}/users/${auth.currentUser.uid}`);
        remove(viewerRef);
      }
    }
  }, [getRoomId]);

  const SignOut = () => {
    auth.signOut().catch((error) => {
      console.error(error)
    })
  }

  return (
    <SafeAreaView>
      <Button title="Create Room" onPress={createRoom} />
      <Button title="Join Room" onPress={joinRoom} />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => setGetRoomId(text)}
        value={getRoomId}
        placeholder="Enter room ID"
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Enter password"
      />
      <View>
        <Text>Email: {auth.currentUser?.email}</Text>
        <Text>Username: {auth.currentUser?.displayName}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: imageUrl }} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <Button title="Sign Out" onPress={SignOut} />
      </View>
    </SafeAreaView>
  )
}
