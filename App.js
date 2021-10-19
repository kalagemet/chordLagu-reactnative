/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  Alert
} from 'react-native';
import AppContainer from './src/navigator/Navigation';
import SplashScreen from  "react-native-splash-screen";
import messaging from '@react-native-firebase/messaging';

const App: () => Node = () => {

  React.useEffect(() => {
    SplashScreen.hide();
    requestUserPermission()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });
    // Unmount FCM if done
    return unsubscribe;
  });

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;    if (enabled) {
      getFcmToken() //<---- Add this
      console.log('Authorization status:', authStatus);
    }
  }

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("Your Firebase Token is:", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  }

  return (
    <AppContainer/>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
