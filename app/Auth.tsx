import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig'

export default function Auth({ navigation }) {

  const [getEmail, setGetEmail] = useState('')
  const [password, setPassword] = useState('')

  const auth = FIREBASE_AUTH

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth,getEmail, password)
      navigation.navigate('Join')
    } catch (error) {
      console.error(error)
    }
  }

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, getEmail, password)
      navigation.navigate('Join')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={{ marginTop: 50 }}>
      <TextInput
        placeholder="Email"
        onChangeText={setGetEmail}
        value={getEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Sign In" onPress={signIn} />
      <Button title="Sign Up" onPress={signUp} />
    </View>
  )
}
