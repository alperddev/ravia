import React, { useState } from 'react'
import { Button, KeyboardAvoidingView, TextInput } from 'react-native'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = getAuth()
  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then()
      if (!userCredential.user.emailVerified) {
        alert('Please verify your email before signing in.')
        auth.signOut()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <Button title="Sign In" onPress={signIn} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
