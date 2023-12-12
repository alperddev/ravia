import React from 'react'
import { View, Text, Image, FlatList } from 'react-native'
import { styles, colorPalette } from '../Style'

export default function Message({ messages, username }) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={{
            flexDirection: item.username === username ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingBottom: 20,
            paddingLeft: 10,
          }}
        >
          {item.username !== username && (
            <>
              <Image source={{ uri: item.photoURL }} style={styles.pp2}></Image>
              <View style={{ paddingHorizontal: 10,backgroundColor:colorPalette.blackL, marginHorizontal:10, borderRadius:10 }}>
                <Text style={{ color: colorPalette.pink, padding:5 }}>{item.username}</Text>
                <Text style={{ color: colorPalette.white, marginRight: 10, padding:5 }}>
                  {item.text}
                </Text>
              </View>
            </>
          )}
          {item.username === username && (
            <View style={{ paddingHorizontal: 10, backgroundColor:colorPalette.blackL, marginHorizontal:10 , borderRadius:10}}>
              <Text style={{ color: colorPalette.white, marginRight: 10 ,padding:5}}>
                {item.text}
              </Text>
            </View>
          )}
        </View>
      )}
    />
  )
}
