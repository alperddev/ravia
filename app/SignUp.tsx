import React, { useState } from 'react'
import {
  Button,
  KeyboardAvoidingView,
  TextInput,
  View,
  Text,
  Alert,
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { auth } from '../firebaseConfig'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = () => {
    navigation.navigate('SignIn')
  }
  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user)
        console.log('Verification email sent.')
        Alert.alert('Verification email sent. Please check your email.')
        navigation.navigate('SignIn')
      }
    } catch (error) {
      console.error(error)
    }
  };
  

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView>
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
    </SafeAreaProvider>
  )
}
