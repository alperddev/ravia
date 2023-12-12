import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../components/Style'
import { auth } from '../firebaseConfig'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Sifre"
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCorrect={false}
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