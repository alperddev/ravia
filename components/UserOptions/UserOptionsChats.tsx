import React from 'react';
import { Modal, Text, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { colorPalette, styles } from '../Style';
import { doc, updateDoc, arrayRemove, arrayUnion, collection, query, where, getDocs, deleteDoc, getDoc, setDoc,  } from 'firebase/firestore';
import { firestore, auth } from '../../firebaseConfig';

export const UserOptions = ({ modalVisible, setModalVisible, selectedUser,chatRoomId ,  }) => {

  async function removeChatRoom() {
    

  }

  async function Block(selectedUser) {

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
            onPress={() => { removeChatRoom(); setModalVisible(false); }}
          >
            <Text>Konusmayi sil</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.Button}
            onPress={() => { Block(selectedUser); setModalVisible(false); }}
          >
            <Text>Engelle</Text>
          </TouchableHighlight>
          
        </View>
    </Modal>
  );
};
