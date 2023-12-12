import React from 'react';
import { Modal, Text, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { colorPalette, styles } from '../Style';
import { auth, firestore } from '../../firebaseConfig';
import { addDoc,  collection, doc, setDoc } from 'firebase/firestore';

export const UserOptions = ({ modalVisible, setModalVisible, selectedUser,  }) => {
  async function createChatRoom() {
    const docRef = await addDoc(collection(firestore, 'chatRooms'), {});
    return docRef.id;
}


async function addFriend() {
  const userRef = doc(firestore, `users/${auth.currentUser.uid}/friends/${selectedUser}`);
  const friendRef = doc(firestore, `users/${selectedUser}/friends/${auth.currentUser.uid}`);
  const chatRoomId = await createChatRoom();

  await setDoc(userRef, {
      chatRoomId: chatRoomId
  });
  await setDoc(friendRef, {
    chatRoomId: chatRoomId
});
}

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableOpacity style={{flex: 1, zIndex:-1}} onPress={() => setModalVisible(false)}/>
        <View style={{backgroundColor:colorPalette.blackL, padding: 20, borderRadius: 10, alignItems: 'center', maxHeight: 400, marginTop: 'auto'}}>
          <TouchableHighlight
            style={styles.Button}
            onPress={() => { addFriend(); setModalVisible(false); }}
          >
            <Text>Add Friend</Text>
          </TouchableHighlight>
        </View>
    </Modal>
  );
};
