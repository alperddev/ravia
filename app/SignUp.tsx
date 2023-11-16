import React, { useState } from 'react'
import {
  Button,
  KeyboardAvoidingView,
  TextInput,
  View,
  Text,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fs, auth } from '../firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'

import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = () => {
    navigation.navigate('SignIn')
  }

  const signUp = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters')
      return
    }
    try {
      const docRef = doc(fs, 'usernames', username)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        Alert.alert(
          'This username is already taken. Please choose another one.'
        )
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        if (userCredential.user) {
          await sendEmailVerification(userCredential.user)
          updateProfile(userCredential.user, {
            displayName: `${username}`,
            photoURL:
              'gs://youaretech-ravia.appspot.com/NBX_Snapshot_2023-11-10_09-19-48-348.png',
          })
          console.log('Verification email sent.')
          Alert.alert('Verification email sent. Please check your email.')
          navigation.navigate('SignIn')
          await setDoc(docRef, { username: username })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <TextInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <Button title="Sign Up" onPress={signUp} />
        <Text>If you already have an account</Text>
        <Button title="Sign In" onPress={signIn} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
