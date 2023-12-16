import React from 'react'
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  TouchableWithoutFeedback,
} from 'react-native'
import { styles } from '../Style'
import { auth, database, firestore } from '../../firebaseConfig'
import { ref, remove, set } from 'firebase/database'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

export const UserOptions = ({
  modalVisible,
  setModalVisible,
  selectedUser,
  roomId,
}) => {
  function kickUser() {
    const userRef = ref(database, `rooms/${roomId}/users/${selectedUser}`)
    remove(userRef)
  }

  function kickAndBanUser() {
    const userRef = ref(database, `rooms/${roomId}/users/${selectedUser}`)
    remove(userRef)

    const bannedUserRef = ref(
      database,
      `rooms/${roomId}/banned/${selectedUser}`
    )
    set(bannedUserRef, true)
  }
  async function createChatRoom() {
    const docRef = await addDoc(collection(firestore, 'chatRooms'), {})
    return docRef.id
  }

  async function addFriend() {
    const userRef = doc(
      firestore,
      `users/${auth.currentUser.uid}/friends/${selectedUser}`
    )
    const friendRef = doc(
      firestore,
      `users/${selectedUser}/friends/${auth.currentUser.uid}`
    )
    const chatRoomId = await createChatRoom()

    await setDoc(userRef, {
      chatRoomId: chatRoomId,
    })
    await setDoc(friendRef, {
      chatRoomId: chatRoomId,
    })
  }

  async function setAdmin() {
    const roomRefGeneral = doc(firestore, `playRooms/${roomId}`)

    updateDoc(roomRefGeneral, {
      Admins: arrayUnion(selectedUser),
    })
    kickUser()
  }

  async function setViewer() {
    const roomRefGeneral = doc(firestore, `playRooms/${roomId}`)

    updateDoc(roomRefGeneral, {
      Admins: arrayRemove(selectedUser),
    })
    kickUser()
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
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={[styles.centeredView]}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={[styles.Text5, { marginBottom: 20 }]}>
                Kullanıcı Seçenekleri
              </Text>
              <TouchableHighlight
                style={styles.Button}
                onPress={() => {
                  setAdmin()
                  setModalVisible(false)
                }}
              >
                <Text>Yönetici Yap </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.Button}
                onPress={() => {
                  setViewer()
                  setModalVisible(false)
                }}
              >
                <Text>İzleyici Yap </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={styles.Button}
                onPress={() => {
                  kickUser()
                  setModalVisible(false)
                }}
              >
                <Text>Kullanıcıyı At </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.Button}
                onPress={() => {
                  kickAndBanUser()
                  setModalVisible(false)
                }}
              >
                <Text>Kullanıcıyı Yasakla </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.Button}
                onPress={() => {
                  addFriend()
                  setModalVisible(false)
                }}
              >
                <Text>Arkadaş Ekle </Text>
              </TouchableHighlight>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
