import 'react-native-gesture-handler';


import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebaseConfig';
import { View, ActivityIndicator } from 'react-native';
import Join from './screens/Join';
import Admin from './screens/Admin';
import Viewer from './screens/Viewer';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import Profile from './screens/Profile';
import { store, persistor, RootState } from './components/Store';
import { colorPalette } from './components/Style';
import Chat from './screens/Chat';
import Chats  from './screens/Chats';
import Rooms from './screens/Rooms';
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: colorPalette.white,
      headerStyle: {backgroundColor:colorPalette.black},
      headerTitleAlign: 'center',

    }}>
      <Stack.Screen name="Join" component={Join} />
      <Stack.Screen name="Rooms" component={Rooms} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Viewer" component={Viewer} />
    </Stack.Navigator>
  );
}


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: 'black',
      headerStyle: {},
      headerTitleAlign: 'center',
      headerShown: false,
    }}>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        if (authenticatedUser) {
          if (!authenticatedUser.emailVerified) {
            auth.signOut();
          } else {
            dispatch({ type: 'SET_USER', user: authenticatedUser });
          }
        }
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, []);
  

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
