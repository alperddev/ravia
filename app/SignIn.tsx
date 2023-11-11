import React, { useState } from 'react';
import { Button, TextInput, View, } from 'react-native';
import { signInWithEmailAndPassword,  } from 'firebase/auth';
import { auth } from '../firebaseConfig';
export default function SignIn ({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        alert('Please verify your email before signing in.');
        auth.signOut();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title="Sign In"
        onPress={signIn}
      />

    </View>
  );
};