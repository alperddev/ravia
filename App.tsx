import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Video from './app/Video'

import { Provider } from 'react-redux'
import store from './app/Store'
import Auth from './app/Auth'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: 'center',
            }}
            
          >
           {/* <Stack.Screen name="Auth" component={Auth} options={{headerShown:false}} /> */}
            <Stack.Screen name="Video" component={Video} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default App
