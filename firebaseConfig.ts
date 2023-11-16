import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
const firebaseConfig = {
  apiKey: 'AIzaSyC6n4FXdva8zT-ED9WJNwGJuv716aVaYas',
  authDomain: 'youaretech-ravia.firebaseapp.com',
  databaseURL: 'https://youaretech-ravia-default-rtdb.firebaseio.com',
  projectId: 'youaretech-ravia',
  storageBucket: 'youaretech-ravia.appspot.com',
  messagingSenderId: '85378285892',
  appId: '1:85378285892:web:4c28e0bb628a2187989711',
}

export const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
export const fs = getFirestore(app)
export const db = getDatabase(app)
