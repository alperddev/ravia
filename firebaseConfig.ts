import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'


import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey:  Constants.manifest?.extra?.firebaseApiKey,
  authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
  databaseURL: Constants.manifest?.extra?.firebaseDatabaseURL,
  projectId: Constants.manifest?.extra?.firebaseProjectId,
  storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
  appId: Constants.manifest?.extra?.firebaseAppId,
}

initializeApp(firebaseConfig)
export const firestore = getFirestore()
export const database = getDatabase()
export const auth = getAuth();
