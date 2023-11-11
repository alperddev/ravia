import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Join from './app/Join';
import { Provider } from 'react-redux';
import store from './app/Store';
import Admin from './app/Admin';
import Viewer from './app/Viewer';
import { useEffect, useState } from 'react';
import SignUp from './app/SignUp';
import SignIn from './app/SignIn';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          console.log('User is signed in and email is verified.');
          setUser(user);
        } else {
          console.log('User is signed in but email is not verified.');
          setUser(null);
        }
      } else {
        console.log('User is signed out.');
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTintColor: 'black',
            headerStyle: {},
            headerTitleAlign: 'center',
          }}
        >
          {user ? (
            <>
              <Stack.Screen name="Join" component={Join} />
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
  );
}
