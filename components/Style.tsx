import { StyleSheet, Dimensions } from 'react-native'

export const colorPalette = {
  green: '#D8FFE4',
  purple: '#B8BFFF',
  black: '#24232B',
  blackL: '#323643',
  emrald: '#383742',
  white: '#EFEFEF',
  pink: '#FDC7C5',
  orange: '#FFA06A',
}

export const styles = StyleSheet.create({
  TextInput: {
    backgroundColor: colorPalette.white,
    borderWidth: 0,
    borderRadius: 15,
    height: 46,
    width: Dimensions.get('window').width * 0.8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  TextInput2: {
    backgroundColor: colorPalette.black,
    borderColor: colorPalette.purple,
    borderWidth: 2,
    borderRadius: 20,
    height: 50,
    width: Dimensions.get('window').width * 0.9,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 17,
    color: colorPalette.white,
  },
  TextInput3: {
    backgroundColor: colorPalette.orange,
    borderWidth: 0,
    borderRadius: 15,
    height: 46,
    width: Dimensions.get('window').width * 0.9,
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 20,
    color: colorPalette.black,
    fontWeight: 'bold',
    fontSize: 17,
  },
  TextInput4: {
    alignSelf: 'center',
    backgroundColor: colorPalette.black,
    borderColor: colorPalette.purple,
    borderWidth: 2,
    borderRadius: 20,
    height: 50,
    width: Dimensions.get('window').width * 0.6,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 17,
    color: colorPalette.white,
  },
  TextInput5: {
    backgroundColor: colorPalette.black,
    borderColor: colorPalette.purple,
    borderWidth: 2,
    borderRadius: 20,
    height: 45,
    width: Dimensions.get('window').width * 0.8,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 15,
    color: colorPalette.white,
  },
  View: {
    backgroundColor: colorPalette.black,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  View2: {
    backgroundColor: colorPalette.black,
    alignSelf: 'flex-end',
    padding: 20,
  },
  View3: {
    backgroundColor: colorPalette.black,
    flex: 1,
  },
  View4: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorPalette.blackL,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 25,
  },
  Button: {
    backgroundColor: colorPalette.purple,
    borderRadius: 15,
    height: 46,
    width: Dimensions.get('window').width * 0.8,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Button2: {
    backgroundColor: colorPalette.blackL,
    borderColor: colorPalette.purple,
    borderWidth: 2,
    borderRadius: 15,
    height: 46,
    width: Dimensions.get('window').width * 0.8,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Button3: {
    backgroundColor: colorPalette.purple,
    borderRadius: 15,
    height: 46,
    width: Dimensions.get('window').width * 0.6,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Button4: {
    backgroundColor: colorPalette.blackL,
    borderColor: colorPalette.purple,
    borderWidth: 2,
    borderRadius: 20,
    height: 45,
    width: Dimensions.get('window').width * 0.8,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Button5: {
    backgroundColor: colorPalette.purple,
    borderRadius: 20,
    height: 45,
    width: Dimensions.get('window').width * 0.8,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    fontWeight: '500',
    fontSize: 17,
    color: colorPalette.black,
  },
  ButtonText2: {
    fontWeight: '400',
    fontSize: 17,
    color: colorPalette.white,
  },
  Text: {
    textAlign: 'center',
    color: colorPalette.white,
    marginBottom: 10,
  },
  Text2: {
    textAlign: 'center',
    color: colorPalette.white,
    marginBottom: 10,
    fontSize: 20,
  },
  Text3: {
    textAlign: 'center',
    color: colorPalette.white,
  },
  Text4: {
    textAlign: 'center',
    color: colorPalette.black,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  Text5: {
    color: colorPalette.white,
    fontSize: 15,
    padding: 10,
  },
  drawer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  drawer2: {
    backgroundColor: colorPalette.black,
    paddingTop: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: Dimensions.get('window').width * 0.7,
  },

  drawer3: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
  },
  open: {
    zIndex: 50,
  },
  open2: {
    zIndex: 49,
  },

  closed: {
    opacity: 0,
    zIndex: -1,
  },
  pp: {
    marginHorizontal: 3,
    width: 60,
    height: 60,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colorPalette.orange,
  },
  pp2: {
    width: 45,
    height: 45,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colorPalette.orange,
  },
  pp3: {
    width: 50,
    height: 50,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colorPalette.orange,
  },
  pp4: {
    width: 100,
    height: 100,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colorPalette.orange,
marginBottom:100
    
  },
  video0: {
    top: 10,
    position: 'absolute',
    backgroundColor: colorPalette.pink,
    justifyContent: 'center',
  },
})