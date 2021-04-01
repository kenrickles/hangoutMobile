import React from 'react';
import {
  Image, StyleSheet, View, Text, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    // marginHorizontal: 16,
  },
  hangoutLogo: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '30%',
  },
  welcomeMessage: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#0d0d0d',
  },
  loginButtonContainer: {
    backgroundColor: '#4ae1b0',
    width: 303,
    height: 52,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'normal',
    letterSpacing: 0.34,
    textAlign: 'center',
    color: '#ffffff'
  },
  registerButtonContainer: {
    backgroundColor: '#ed4c59',
    width: 303,
    height: 52,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  buttonView: {
    justifyContent: 'center',
    
  }
});

function WelcomeScreen(props) {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/hangout-logo.png')}
        resizeMode="cover"
        style={styles.hangoutLogo} />
      <Text style={styles.welcomeMessage}>
      Welcome to Hangout? Messenger!{'\n'}You never know when a message {'\n'}
        will become an opportunity!
      </Text>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.loginButtonContainer}
          onPress={() => {navigation.navigate('Login');}} 
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.registerButtonContainer}
          onPress={() => {navigation.navigate('Register');}} 
        >
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default WelcomeScreen;
