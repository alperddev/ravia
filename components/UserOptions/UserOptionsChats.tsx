import React from 'react'
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from 'react-native'
import { colorPalette, styles } from '../Style'
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from '../../firebaseConfig'

export const UserOptions = ({
  modalVisible,
  setModalVisible,
  selectedUser,
  chatRoomId,
}) => {
  async function deleteChat() {
    const chatRef = collection(
      firestore,
      `chatRooms/${chatRoomId}/${auth.currentUser?.uid}`
    )

    const querySnapshot = await getDocs(chatRef)
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
    })
  }
  async function removeFriend() {
    const chatRoomRef = doc(
      firestore,
      `users/${auth.currentUser.uid}/friends/${selectedUser}`
    )
    const chatRoomRef2 = doc(
      firestore,
      `users/${selectedUser}/friends/${auth.currentUser.uid}`
    )
    await deleteDoc(chatRoomRef)
    await deleteDoc(chatRoomRef2)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false)
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, zIndex: -1 }}
        onPress={() => setModalVisible(false)}
      />
      <View
        style={{
          backgroundColor: colorPalette.blackL,
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          maxHeight: 400,
          marginTop: 'auto',
        }}
      >
        <TouchableHighlight
          style={styles.Button}
          onPress={() => {
            removeFriend()
            setModalVisible(false)
          }}
        >
          <Text>Arkadaşlığı sil</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.Button}
          onPress={() => {
            deleteChat()
            setModalVisible(false)
          }}
        >
          <Text>Konusmayi sil</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  )
}
