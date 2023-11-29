import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Join from './app/Join'
import { Provider } from 'react-redux'
import store from './app/Store'
import Admin from './app/Admin'
import Viewer from './app/Viewer'
import { useEffect, useState } from 'react'
import SignUp from './app/SignUp'
import SignIn from './app/SignIn'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'
import Profile from './app/Profile'

const Stack = createNativeStackNavigator()

export default function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          setUser(user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [user])
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTintColor: 'black',
            headerStyle: {},
            headerTitleAlign: 'center',
            headerShown: false,
            statusBarStyle: 'light',
            statusBarTranslucent: true,
            navigationBarHidden: true,
          }}
        >
          {user ? (
            <>
              <Stack.Screen name="Join" component={Join} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Admin" component={Admin} />
              <Stack.Screen name="Viewer" component={Viewer} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="SignIn" component={SignIn} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
