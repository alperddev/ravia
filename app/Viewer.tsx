import React, {useEffect} from 'react'
import {
  View,

} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from './Store'
import {push, ref, remove, set } from 'firebase/database'
import { auth, db} from '../firebaseConfig'
import UserList from '../components/UserList'
import Message from '../components/Message'
import ViewerPlayer from '../components/ViewerPlayer'
export default function Viewer() {
  const roomId = useSelector((state: RootState) => state.roomId)

  useEffect(() => {
    if (roomId && auth.currentUser) {
      const viewersRef = ref(db, `rooms/${roomId}/users/viewers`)
      const newViewerRef = push(viewersRef)
      set(newViewerRef, auth.currentUser.uid)
        return () => {
        remove(newViewerRef)
      }
    }
  }, [roomId])



  return (
    <View style={{ flex: 1 }}>
<ViewerPlayer/>
                  <UserList/>

          <Message/>
    </View>
  )
}
