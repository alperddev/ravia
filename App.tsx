import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Join from './app/Join'
import { Provider} from 'react-redux'
import store from './app/Store'
import Auth from './app/Auth'
import Admin from './app/Admin'
import Viewer from './app/Viewer'


const Stack = createNativeStackNavigator()

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTintColor: 'black',
              headerStyle: {},
              headerTitleAlign: 'center',
            }}
            initialRouteName="Auth"
          >
            <Stack.Screen name="Auth" component={Auth} options={{headerShown:false}} />
            <Stack.Screen name="Join" component={Join} />
            <Stack.Screen name="Admin" component={Admin} />
            <Stack.Screen name="Viewer" component={Viewer} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default App
