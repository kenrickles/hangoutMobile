import React, { useEffect, useState } from 'react';
import {
  Image, StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import firebase from '../../database/firebase.js';

const styles = StyleSheet.create({
  container:{
    flex: 0.8,
    justifyContent: 'center',
    // marginHorizontal: 16,
  },
  TextInputContainer:{
    flexDirection:'row',
    padding: 20,
    marginLeft: 10,
  },

  hangoutLogo: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '30%',
  },
  loginButtonContainer: {
    backgroundColor: '#4ae1b0',
    width: 293,
    height: 52,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'normal',
    letterSpacing: 0.34,
    textAlign: 'center',
    color: '#ffffff'
  },
  inputText: {
    width: '75%',
    marginLeft: 15,
    marginBottom: 15,
    paddingBottom: 15,
    fontSize: 18,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1
  },
  buttonView: {
    justifyContent: 'center',
    
  },
  signupText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  errorMessage: {
    alignSelf: 'center',
    fontSize: 16,
    color: 'red',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});
const ref = firebase.database().ref('users/');
function LoginScreen(props) {
  const navigation = useNavigation();
  // Declaration of states
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorPresent, setErrorPresent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // User Login Function with Firebase Authentication
  const userLogin = () => {
    if (email === '' && password === '') {
      Alert.alert('Enter Details to Login');
    } else {
      setIsLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          console.log('User logged-in successfully authenticated!');
          ref.orderByChild('userid').equalTo(res.user.uid).once('value', (snapshot) => {
            console.log(snapshot);
            if (snapshot.exists()) {
              setIsLoading(false);
              navigation.navigate('MessageOverviewScreen');
              setEmail('');
              setPassword('');
            } else {
              // console.log(res);
              //     /* create a new using in the firebase database and set localStorage
              //     to hold the values of email, name and userId */
              //     // create a new user
              const newUser = firebase.database().ref('users/').push();
              //     // set the new user Information to firebase
              newUser.set({ name: res.user.displayName, userid: res.user.uid, email: res.user.email.toLowerCase() });
              setIsLoading(false);
              navigation.navigate('MessageOverviewScreen');
              setEmail('');
              setPassword('');
              //     // take the user to home route
              navigation.navigate('MessageOverviewScreen');
            }
          });
          
          
        })
        .catch(error =>  {
          setIsLoading(false);
          setErrorPresent(true);
          console.log(errorMessage);
          setErrorMessage('Invalid Username or Password. Please try again.');
        });
    }
  };

  if(isLoading){
    return(
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E"/>
      </View>
    );
  }  
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../assets/hangout-logo.png')}
          resizeMode="cover"
          style={styles.hangoutLogo} />
        {errorPresent && (<Text style={styles.errorMessage}>
          {errorMessage}
        </Text>)}
        <View style={styles.TextInputContainer}>
          <MaterialCommunityIcons name="email" size={30} color="lightgrey"></MaterialCommunityIcons>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          > 
          </TextInput>
        </View>
        <View style={styles.TextInputContainer}>
          <MaterialCommunityIcons name="lock" size={30} color="lightgrey"></MaterialCommunityIcons>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            maxLength={15}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.loginButtonContainer}
            onPress={userLogin} 
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.signupText} onPress={() => {navigation.navigate('Register');}} >
        Don't have an account? Click here to sign up
        </Text>
      </SafeAreaView>
    </>
  );
}

export default LoginScreen;
