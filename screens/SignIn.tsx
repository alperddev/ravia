import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native'
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../components/Style'
import { auth, firestore, storage } from '../firebaseConfig'
import { useDispatch} from 'react-redux'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, listAll, ref,  } from 'firebase/storage'
import { set } from 'firebase/database'
export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
const random = [
  'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/defaultImages%2Fpp5.png?alt=media&token=d7eaf47f-02a2-42af-b8cd-154029aad582',
   'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/defaultImages%2Fpp4.png?alt=media&token=61a706ae-a672-4559-bb4e-18038c2a676b', 
   'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/defaultImages%2Fpp3.png?alt=media&token=9dde73ff-0ee6-4386-8576-304ccd70c274', 
   'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/defaultImages%2Fpp2.png?alt=media&token=8300a10e-d423-4cf0-a959-8e85438690cc', 
   'https://firebasestorage.googleapis.com/v0/b/youaretech-ravia.appspot.com/o/defaultImages%2Fpp1.png?alt=media&token=15cefaa2-dd6a-4aed-b070-e7b575787aaf'
  ]
  const [pp, setPp] = useState(random[Math.floor(Math.random() * random.length)])
  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then()
  
      if (!userCredential.user.emailVerified) {
        alert('Lutfen giris yapmadan once mailini dogrula.')
        auth.signOut()
      } else  {
        setPp(pp)
        const userDoc = doc(firestore, `users/${auth.currentUser?.uid}`)
        const docSnap = await getDoc(userDoc)
        if (docSnap.exists() === false) {
         
          await setDoc( doc(firestore, `users/${auth.currentUser?.uid}`), {
            username: `${email.substring(0, email.indexOf('@'))}`,
            email: email,
            pp: pp
          })
          updateProfile(auth.currentUser, {
            displayName: `${email.substring(0, email.indexOf('@'))}`,
          })
          dispatch({type: 'SET_PROFILEPICTURE', profilePicture: pp  })

        }
        else {
          dispatch({type: 'SET_PROFILEPICTURE', profilePicture: docSnap.data().pp  })

        }
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
        <Text style={styles.Text}>Hesabiniz yok mu ?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={styles.Button2}
        >
          <Text style={styles.ButtonText2}>Kayit Olun</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
