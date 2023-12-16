import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { styles } from '../components/Style'
import { useDispatch } from 'react-redux'
export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

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

        Alert.alert(
          'Dogrulama maili gonderildi. Lutfen gelen kutunu kontrol et.'
        )
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
