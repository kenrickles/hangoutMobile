import React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, SafeAreaView, View } from 'react-native';

function Screen({ children, style }) {
  // As safe area view only works for iOS, Android we will add a padding of the device's status bar height in the styles. Also, by putting the style in a tag, allows us to have mutiple style, making this a resuable component
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    // Expo constants will allow us to retrieve the status bar height of the device. 
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
