import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, firestore } from '../firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { styles } from '../components/Style'
import { useDispatch } from 'react-redux'
export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const dispatch = useDispatch()

  const signUp = async () => {
    if (!(password === password2)) {
      Alert.alert('Hata', 'Sifreler ayni olmali')
      return
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Sifre en az 6 karakter olmali')
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user)
        updateProfile(userCredential.user, {
          displayName: `${email.substring(0, email.indexOf('@'))}`,
        })
        await setDoc(doc(firestore, `users/${userCredential.user.uid}`), {
          username: `${email.substring(0, email.indexOf('@'))}`,
          email: email,
          pp: 'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/pp.png?alt=media&token=c399cce8-6805-48c7-bae0-3e603973bdef',
        })
        Alert.alert(
          'Dogrulama maili gonderildi. Lutfen gelen kutunu kontrol et.'
        )
        dispatch({
          type: 'SET_PROFILEPICTURE',
          profilePicture:
            'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/pp.png?alt=media&token=c399cce8-6805-48c7-bae0-3e603973bdef',
        })
        navigation.navigate('SignIn')
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
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Sifre"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Sifre tekrar"
          onChangeText={(text) => setPassword2(text)}
          value={password2}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
        />
        <TouchableOpacity onPress={signUp} style={styles.Button}>
          <Text style={styles.ButtonText}>Hesap Olustur</Text>
        </TouchableOpacity>
        <Text style={styles.Text}>Zaten hesabınız var mı?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          style={styles.Button2}
        >
          <Text style={styles.ButtonText2}>Giris Yapin</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
