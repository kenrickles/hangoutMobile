import React, { useState } from 'react';
import {SafeAreaView, StyleSheet, Image, View, TouchableOpacity, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import firebase from '../../database/firebase.js';


const styles = StyleSheet.create({
  container:{
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hangoutLogo: {
    backgroundColor: 'transparent',
    width: '75%',
    height: '25%',
    alignSelf: 'center',
    paddingTop: 100,
    marginTop: -100,
  },
  buttonView: {
    justifyContent: 'center',
    
  },
  registerButtonContainer: {
    backgroundColor: '#ed4c59',
    width: 303,
    height: 52,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
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
  signupText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  imageContainer: {
    flex: 0.6,
  },
  TextInputContainer:{
    padding: 10,
    marginTop: -100,
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
export default function RegisterScreen() {
  const navigation = useNavigation();
  // Declaration of states needed
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('initialState');
  const [isLoading, setIsLoading] = useState(false);

  // register function
  const registerUser = () => {
    if (email === '' || name === '' || password === '' || confirmPassword === '') {
      Alert.alert('Please fill in details to register');
    } else {
      setIsLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          console.log('inside fb auth');
          res.user.updateProfile({
            displayName: name,
          });
          console.log('User registered successfully!');
          setIsLoading(false);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setName('');
          navigation.navigate('Login');
        })
        .catch(error => {setErrorMessage(error);});      
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
      </SafeAreaView>
      <View style={styles.TextInputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        > 
        </TextInput>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        > 
        </TextInput>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        > 
        </TextInput>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        > 
        </TextInput>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.registerButtonContainer}
          onPress={registerUser} 
        >
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
        <Text style={styles.signupText} onPress={() => {navigation.navigate('Login');}}>
        Already have an account? Click here to login
        </Text>
      </View>
    </>
  );
}
