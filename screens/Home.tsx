import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colorPalette, styles } from '../components/Style'
import JoinRoom from '../components/Join'
import CreateRoom from '../components/Create'
import { useFocusEffect } from '@react-navigation/native'
import Rooms from '../components/Rooms'
import { useSelector } from 'react-redux'
import { RootState } from '../components/Store'
import { Entypo } from '@expo/vector-icons'
export default function Home({ navigation }) {
  const profilePicture = useSelector((state: RootState) => state.profilePicture)
  const [modalVisible, setModalVisible] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      return () => setModalVisible(false)
    }, [])
  )

  return (
    <SafeAreaView style={styles.View}>
      <View style={styles.View2}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: profilePicture }} style={styles.pp} />
        </TouchableOpacity>
      </View>
      <View style={styles.View}>
        <Rooms navigation={navigation} />
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <Entypo name="plus" size={30} color={colorPalette.black} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={[styles.centeredView]}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <CreateRoom navigation={navigation} />
                <JoinRoom navigation={navigation} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}
