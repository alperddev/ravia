import React, {useEffect, useState } from 'react'
import {
  View,
  TextInput,
  Button,
} from 'react-native'
import {  push, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'
import { RootState } from './Store'
import { auth, db} from '../firebaseConfig'
import UserList from '../components/UserList'
import Message from '../components/Message'
import AdminPlayer from '../components/AdminPlayer'
import { Drawer } from '../components/UsersDrawer'

export default function Admin() {
  const roomId = useSelector((state: RootState) => state.roomId)
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };


  useEffect(() => {
    if (roomId && auth.currentUser) {
      const adminsRef = ref(db, `rooms/${roomId}/users/admins`)
      set(push(adminsRef), auth.currentUser.uid)
  
      return () => {
        const roomRef = ref(db, `rooms/${roomId}`)
        remove(roomRef)
      }
    }
  }, [roomId])
  
  

  return (
    <View style={{flex:1}} >
      <Button title='drawer' onPress={toggleDrawer}/>
<Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer}/>
    <View style={{paddingTop:30}} >

     <AdminPlayer/>
            <UserList/>

      <TextInput
        editable={false}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={roomId}
      />
      <Message/>
    </View>
    </View>
  )
}