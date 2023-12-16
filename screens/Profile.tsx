import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { auth, firestore } from '../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import * as ImagePicker from 'expo-image-picker'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL,  } from 'firebase/storage'
import { colorPalette, styles } from '../components/Style'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../components/Store'
import { ScrollView } from 'react-native-gesture-handler'
import {storage} from '../firebaseConfig'

export default function Profile({ navigation }) {
  const [username, setUsername] = useState(auth.currentUser?.displayName)
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const profilePicture = useSelector((state: RootState) => state.profilePicture)
  const dispatch = useDispatch()


  
  const uploadImage = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri)
      const blob = await response.blob()
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/pp`)
      await uploadBytes(storageRef, blob)
      const url = await getDownloadURL(storageRef)
      const userDoc = doc(firestore, `users/${auth.currentUser.uid}`)
      await updateDoc(userDoc, { pp: url })
      dispatch({ type: 'SET_PROFILEPICTURE', profilePicture: url })
    }
  }

  const changeUsername = async () => {
    if (username.length < 6) {
      Alert.alert('Hata', 'Kullanici adi en az 6 karakter olmali')
      return
    }
    if (username.length > 30) {
      Alert.alert('Hata', 'Kullanici adi en fazla 30 karakter olmali')
      return
    }
    try {
      const docRef = doc(firestore, `users/${auth.currentUser?.uid}`)

      await updateProfile(auth.currentUser, {
        displayName: username,
      })
      await updateDoc(docRef, { username: username })
    } catch (error) {
      console.error(error)
      Alert.alert('Hata', 'Kullanici adini guncelleme basarisiz oldu')
    }
  }

  const changePassword = async () => {
    if (password.length < 6) {
      Alert.alert('Hata', 'Sifre en az 6 karakter olmali')
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
            Alert.alert('Basarili', 'Sifre basaiyla guncellendi')
          })
          .catch((error) => {
            console.error(error)
            Alert.alert('Hata', 'Sifre guncelleme basarisiz oldu')
          })
      })
      .catch((error) => {
        console.error(error)
        Alert.alert(
          'Hata',
          'Sifre onayi basarisiz oldu. Lutfen Sifreni kontrol et.'
        )
      })
  }

  const SignOut = async () => {
    try {
      await auth.signOut()
      dispatch({ type: 'SET_USER', user: null })
      navigation.replace('SignIn')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={styles.View}>
      <TouchableOpacity style={{ marginTop: 30 }} onPress={uploadImage}>
        <Image source={{ uri: profilePicture }} style={styles.pp4} />
      </TouchableOpacity>
      <ScrollView >

        <Text style={styles.Text5}>Email: {auth.currentUser?.email}</Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.TextInput5}
        />
        <TouchableOpacity onPress={changeUsername} style={styles.Button4}>
          <Text style={styles.ButtonText2}>Kullanici adini degistir</Text>
        </TouchableOpacity>
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Sifreni gir"
          secureTextEntry
          style={styles.TextInput5}
          placeholderTextColor={colorPalette.white}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Yeni sifreni gir"
          secureTextEntry
          style={styles.TextInput5}
          placeholderTextColor={colorPalette.white}
        />
        <TouchableOpacity onPress={changePassword} style={styles.Button4}>
          <Text style={styles.ButtonText2}>Sifreni degistir</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={SignOut} style={styles.Button5}>
          <Text style={styles.ButtonText}>Cikis yap</Text>
        </TouchableOpacity>
        </ScrollView>

    </SafeAreaView>
  )
}
