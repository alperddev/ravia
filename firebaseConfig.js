import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC6n4FXdva8zT-ED9WJNwGJuv716aVaYas',
  authDomain: 'youaretech-ravia.firebaseapp.com',
  databaseURL: 'https://youaretech-ravia-default-rtdb.firebaseio.com/',
  projectId: 'youaretech-ravia',
  storageBucket: 'youaretech-ravia.appspot.com',
  messagingSenderId: '85378285892',
  appId: '1:85378285892:web:4c28e0bb628a2187989711',
}

const app = initializeApp(firebaseConfig)
export const firestore = getFirestore(app)
export const database = getDatabase(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
export const storage = getStorage(app)
