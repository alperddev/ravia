import React, { useState } from 'react'
import { View, Button, Text, Image, TextInput, Alert } from 'react-native'
import { auth, fs } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import * as ImagePicker from 'expo-image-picker'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Profile({ navigation }) {
  const [imageUrl, setImageUrl] = useState(null)
  const storage = getStorage()
  const [username, setUsername] = useState(auth.currentUser?.displayName)
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  React.useEffect(() => {
    const gsReference = ref(storage, auth.currentUser?.photoURL)

    getDownloadURL(gsReference)
      .then((url) => {
        setImageUrl(url)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const uploadImage = async (uri) => {
    const response = await fetch(uri)
    const blob = await response.blob()
    const storageRef = ref(storage, `images/${auth.currentUser.uid}`)
    const uploadTask = uploadBytesResumable(storageRef, blob)

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.error(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
          setImageUrl(downloadURL)
        })
      }
    )
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      const { assets } = result
      if (assets && assets.length > 0) {
        const { uri } = assets[0]
        uploadImage(uri)
      }
    }
  }

  const changeUsername = async () => {
    try {
      const docRef = doc(fs, 'usernames', username)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        Alert.alert(
          'This username is already taken. Please choose another one.'
        )
      } else {
        await updateProfile(auth.currentUser, {
          displayName: username,
        })
        await setDoc(docRef, { username: username })
      }
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

        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={{ width: 50, height: 50 }} />
        )}
        <Button title="Upload Image" onPress={pickImage} />
      </View>
    </SafeAreaView>
  )
}
