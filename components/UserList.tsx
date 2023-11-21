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
      const usersRef = ref(db, `rooms/${roomId}/users`);
      const usersSnapshot = await get(usersRef);
      const users = usersSnapshot.val() || {};
  
      const fetchedUsers = [];
      const fetchedPhotoURLs = [];
  
      for (const userId in users) {
        const userDoc = await getDoc(doc(fs, `users/${userId}`));
        const pp = userDoc.data().pp;
  
        fetchedUsers.push(userId);
        fetchedPhotoURLs.push(pp && typeof pp === 'string' ? pp : null);
      }
  
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

