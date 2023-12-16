import React from 'react'
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from 'react-native'
import { colorPalette, styles } from './Style'
import { doc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from '../firebaseConfig'

export const RoomOptions = ({
  modalVisible,
  setModalVisible,
  roomId,
  fetchRooms,
}) => {
  async function removeRoom() {
    const roomRef = doc(
      firestore,
      `users/${auth.currentUser.uid}/rooms/${roomId}`
    )
    await deleteDoc(roomRef)
    fetchRooms()
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
            removeRoom()
            setModalVisible(false)
          }}
        >
          <Text>Odayi sil</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  )
}
