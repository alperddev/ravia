import React, { useState, useEffect } from 'react';
import { View, ImageBackground } from 'react-native';
import { get,  ref } from 'firebase/database';
import {  db, fs } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../app/Store';


export default function UserList() {


  
  const [users, setUsers] = useState([]);
  const [photoURL, setPhotoURL] = useState([]);
  const roomId = useSelector((state: RootState) => state.roomId);

  
  useEffect(() => {
    const fetchUsers = async () => {
      const adminsRef = ref(db, `rooms/${roomId}/users/admins`);
      const viewersRef = ref(db, `rooms/${roomId}/users/viewers`);
  
      const adminsSnapshot = await get(adminsRef);
      const viewersSnapshot = await get(viewersRef);
  
      const admins = adminsSnapshot.val() || {};
      const viewers = viewersSnapshot.val() || {};
  
      const fetchedUsers  =  [...Object.values(admins) , ...Object.values(viewers) ];
  
      const fetchedPhotoURLs = await Promise.all(
        fetchedUsers.map(async (user) => {
          const userDoc = await getDoc(doc(fs, `users/${user}`));
          const pp = userDoc.data().pp;
          return pp && typeof pp === 'string' ? pp : null;
        })
      );
    
      setUsers(fetchedUsers);
      setPhotoURL(fetchedPhotoURLs);
    };
    
    fetchUsers();
  }, [roomId, users]);
  
  

  return (
<View style={{ flexDirection: 'row' }}>
  {users.map((user, index) => (
    photoURL[index] && (
      <ImageBackground
        key={index}
        source={{ uri: photoURL[index] }}
        style={{ width: 50, height: 50 }}
      />
    )
  ))}
</View>

  );
}

