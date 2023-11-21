import React, {useEffect, useState } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native'
import { get,  ref, remove, set } from 'firebase/database';
import {  db, fs } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../app/Store';



export const Drawer = ({ isOpen, toggleDrawer }) => {
    const [usernames, setUsernames] = useState([]);

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
  
      const fetchedPhotoURLs = [];
      const fetchedUsernames = [];
  
      for (const user of fetchedUsers) {
        const userDoc = await getDoc(doc(fs, `users/${user}`));
        const pp = userDoc.data().pp;
        const username = userDoc.data().username;
        fetchedPhotoURLs.push(pp && typeof pp === 'string' ? pp : null);
        fetchedUsernames.push(username);
      }
  
      setUsers(fetchedUsers);
      setPhotoURL(fetchedPhotoURLs);
      setUsernames(fetchedUsernames);
    };    
    fetchUsers();
  }, [roomId, users]);
  
  function kickUser(user) {
    const userRef = ref(db, `rooms/${roomId}/users/viewers`);
    remove(userRef);
  }
    
 
return (
    <View style={[styles.drawer, isOpen ? styles.open : styles.closed]}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Text>Close Drawer</Text>
      </TouchableOpacity>
      {users.map((user, index) => (
        photoURL[index] && (
          <View key={index} style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => kickUser(user)}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <ImageBackground
                  source={{ uri: photoURL[index] }}
                  style={{ width: 50, height: 50 }}
                />
                <Text>{usernames[index]}</Text>
              </View> 
            </TouchableOpacity>
          </View>
        )
      ))}
    </View>
  );
};



const styles = StyleSheet.create({
  drawer: {
    flex:1,
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: 'lightgrey',
  },
  open: {
    zIndex: 50,
  },
  closed: {
    opacity:0,
    zIndex: -1,
  },
});
