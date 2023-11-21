import React, {useEffect, useState } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Button,
  Alert
} from 'react-native'
import { get,  ref, remove, set } from 'firebase/database';
import {  auth, db, fs } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../app/Store';

export const Drawer = ({ isOpen, toggleDrawer }) => {
  const [users, setUsers] = useState([]);
  const [photoURL, setPhotoURL] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const roomId = useSelector((state: RootState) => state.roomId);
  const [password, setPassword]=useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = ref(db, `rooms/${roomId}/users`);
      const usersSnapshot = await get(usersRef);
      const users = usersSnapshot.val() || {};

      const fetchedUsers = [];
      const fetchedPhotoURLs = [];
      const fetchedUsernames = [];

      for (const userId in users) {
        const userDoc = await getDoc(doc(fs, `users/${userId}`));
        const pp = userDoc.data().pp;
        const username = userDoc.data().username;

        fetchedUsers.push(userId);
        fetchedPhotoURLs.push(pp && typeof pp === 'string' ? pp : null);
        fetchedUsernames.push(username && typeof username === 'string' ? username : null);
      }

      setUsers(fetchedUsers);
      setPhotoURL(fetchedPhotoURLs);
      setUsernames(fetchedUsernames);
    };

    fetchUsers();
  }, [roomId, users]);
  
  function kickUser(user) {
    const userRef = ref(db, `rooms/${roomId}/users/${user}`);
    remove(userRef);
  }
  
  function kickAndBanUser(user) {
    const userRef = ref(db, `rooms/${roomId}/users/${user}`);
    remove(userRef);
  
    const bannedUserRef = ref(db, `rooms/${roomId}/banned/${user}`);
    set(bannedUserRef, true);
  }
function handleUserPress(user) {
  if (user === auth.currentUser.uid) {
    return;
  }

  Alert.alert(
    "User Options",
    "Would you like to kick or ban this user?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "Kick", onPress: () => kickUser(user) },
      { text: "Ban", onPress: () => kickAndBanUser(user) }
    ]
  );
}

  
  function handlePassword() {
    if (roomId && auth.currentUser) {
      const passwordRef = ref(db, `rooms/${roomId}/password`);
      set(passwordRef, password);
    }    
  }
 
  return (
    <View style={[styles.drawer, isOpen ? styles.open : styles.closed]}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Text>Close Drawer</Text>
      </TouchableOpacity>
      {users.map((user, index) => (
        photoURL[index] && (
          <View key={index} style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => handleUserPress(user)}>
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
      <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Set Password" onPress={handlePassword} />
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
