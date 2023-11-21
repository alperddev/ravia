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
import { auth, fs } from '../firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = () => {
    navigation.navigate('SignIn')
  }
  const signUp = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        updateProfile(userCredential.user, {
          displayName: `${email.substring(0, email.indexOf('@'))}`,
        });
        await setDoc(doc(fs, `users/${userCredential.user.uid}`), {
          username: `${email.substring(0, email.indexOf('@'))}`,
          email: email,
          pp: 'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/user.png?alt=media&token=48f8e3ab-cd34-4be5-bf9f-6f953f6c1d7b',
        });
        console.log('Verification email sent.');
        Alert.alert('Verification email sent. Please check your email.');
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <SafeAreaView>
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
    </SafeAreaView>
  )
}
