import React, { useEffect, useState } from 'react'
import { View, Button, Text, Image, TextInput, Alert } from 'react-native'
import { auth, fs } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import * as ImagePicker from 'expo-image-picker'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function Profile({ navigation }) {
  const [imageUrl, setImageUrl] = useState(null)
  const storage = getStorage()
  const [username, setUsername] = useState(auth.currentUser?.displayName)
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/pp`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      const userDoc = doc(fs, `users/${auth.currentUser.uid}`);
      await updateDoc(userDoc, { pp: url });
      setImageUrl(url);
    }
  };
  
  useEffect(() => {
    const fetchPP = async () => {
      const docSnap = await getDoc(doc(fs, `users/${auth.currentUser?.uid}`))
      setImageUrl(docSnap.data().pp)
    }

    fetchPP()
  }, [])
  
  const changeUsername = async () => {
    try {
      const docRef = doc(fs, `users/${auth.currentUser?.uid}`)

        await updateProfile(auth.currentUser, {
          displayName: username,
        })
        await setDoc(docRef, { username: username })
      
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to update username')
    }
  }

  const changePassword = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters')
      return
    }

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    )

    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        updatePassword(auth.currentUser, password)
          .then(() => {
            Alert.alert('Success', 'Password updated successfully')
          })
          .catch((error) => {
            console.error(error)
            Alert.alert('Error', 'Failed to update password')
          })
      })
      .catch((error) => {
        console.error(error)
        Alert.alert(
          'Error',
          'Failed to re-authenticate. Please check your current password.'
        )
      })
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Email: {auth.currentUser?.email}</Text>
        <Text>Username: {auth.currentUser?.displayName}</Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter new username"
        />
        <Button title="Change Username" onPress={changeUsername} />

        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
          secureTextEntry
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          secureTextEntry
        />
        <Button title="Change Password" onPress={changePassword} />
        <Image source={{ uri: imageUrl }} style={{ width: 50, height: 50 }} />
        <Button title="Upload Profile Picture" onPress={uploadImage} />
      </View>
    </SafeAreaView>
  )
}
