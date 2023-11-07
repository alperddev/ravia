import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAB_PaRBTN3DOjeveEC011sf6k3NL7JDLw',
  authDomain: 'ravia-youaretech.firebaseapp.com',
  databaseURL: 'https://ravia-youaretech-default-rtdb.firebaseio.com',
  projectId: 'ravia-youaretech',
  storageBucket: 'ravia-youaretech.appspot.com',
  messagingSenderId: '701580445900',
  appId: '1:701580445900:web:14076d410ebebedded5a69',
  measurementId: 'G-PQXGJJ50P2',
}

export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIREBASE_STORE = getFirestore(FIREBASE_APP)
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIREBASE_DB = getDatabase(FIREBASE_APP)
