import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import WelcomeScreen from './app/screens/WelcomeScreen.jsx';
import LoginScreen from './app/screens/LoginScreen.jsx';
import RegisterScreen from './app/screens/RegisterScreen.jsx';
import MessageOverviewScreen from './app/screens/MessageOverviewScreen.jsx';
import MessageScreen from './app/screens/MessageScreen.jsx';

console.disableYellowBox = true;
const Stack = createStackNavigator();


export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MessageOverviewScreen" component={MessageOverviewScreen} />
          <Stack.Screen name="MessageScreen" component={MessageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
