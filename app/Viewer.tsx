import React, {useEffect} from 'react'
import {
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './Store'
import {push, ref, remove, set, onValue, off } from 'firebase/database'
import { auth, db} from '../firebaseConfig'
import UserList from '../components/UserList'
import Message from '../components/Message'
import ViewerPlayer from '../components/ViewerPlayer'

export default function Viewer({navigation}) {
  const roomId = useSelector((state: RootState) => state.roomId)
  const dispatch = useDispatch()

  useEffect(() => {
    if (roomId && auth.currentUser) {
      const usersRef = ref(db, `rooms/${roomId}/users`);
      const checkUserPresence = (snapshot) => {
        if (!snapshot.hasChild(auth.currentUser.uid)) {
          navigation.navigate('Join');
                }
      };

      onValue(usersRef, checkUserPresence);

      return () => {
        off(usersRef, 'value', checkUserPresence);
      }
    }
  }, [roomId]);

  return (
    <View style={{ flex: 1 }}>
      <ViewerPlayer/>
      <UserList/>
      <Message/>
    </View>
  )
}
