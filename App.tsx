import 'react-native-gesture-handler'

import React, { useState, useEffect } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from './firebaseConfig'
import { View, ActivityIndicator } from 'react-native'
import Home from './screens/Home'
import Admin from './screens/Admin'
import Viewer from './screens/Viewer'
import SignUp from './screens/SignUp'
import SignIn from './screens/SignIn'
import Profile from './screens/Profile'
import { store, persistor, RootState } from './components/Store'
import { colorPalette } from './components/Style'
import Chat from './screens/Chat'
import Chats from './screens/Chats'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorPalette.white,
        tabBarInactiveTintColor: colorPalette.blackL,
        tabBarStyle: { backgroundColor: colorPalette.black },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              color={focused ? colorPalette.white : colorPalette.blackL}
              size={focused ? 28 : 24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="chat"
              color={focused ? colorPalette.white : colorPalette.blackL}
              size={focused ? 28 : 26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="person"
              color={focused ? colorPalette.white : colorPalette.blackL}
              size={focused ? 28 : 26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colorPalette.white,
        headerStyle: { backgroundColor: colorPalette.black },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Admin"
        component={Admin}
        options={{ title: 'Yonetici' }}
      />
      <Stack.Screen
        name="Viewer"
        component={Viewer}
        options={{ title: 'İzleyici' }}
      />
    </Stack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: 'black',
        headerStyle: {},
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  )
}

function RootNavigator() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser) {
          if (!authenticatedUser.emailVerified) {
            auth.signOut()
          } else {
            dispatch({ type: 'SET_USER', user: authenticatedUser })
          }
        }
        setIsLoading(false)
      }
    )
    return unsubscribeAuth
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  )
}
