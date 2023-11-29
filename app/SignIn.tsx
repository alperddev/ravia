import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  BackHandler,
} from 'react-native'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../components/Style'
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = getAuth()
  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then( )
      if (!userCredential.user.emailVerified) {
        alert('Lutfen giris yapmadan once mailini dogrula.')
        auth.signOut()
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={styles.View}>
      <KeyboardAvoidingView>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Sifre"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={signIn} style={styles.Button}>
          <Text style={styles.ButtonText}>Giris Yapin</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
