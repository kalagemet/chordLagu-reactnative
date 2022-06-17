/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { Alert } from "react-native";
import AppContainer from "./src/navigator/Navigation";
import SplashScreen from "react-native-splash-screen";
import messaging from "@react-native-firebase/messaging";
import * as STORAGE from "./src/Storage";
import * as RootNavigation from "./src/navigator/RootNavigation";

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
      RootNavigation.navigate("Main", { screen: "ProfileStack" });
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          RootNavigation.navigate("Main", { screen: "ProfileStack" }); // e.g. "Settings"
        }
      });
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
      if (remoteMessage.data.id) {
        let notification = {
          item: remoteMessage.notification.title,
          item_id: remoteMessage.data.id,
          message: remoteMessage.notification.body,
          timestamp: new Date().toString(),
          read: false,
        };
        STORAGE.setRequestNotifications(notification);
      }
    });
    // Unmount FCM if done
    return unsubscribe;
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken(); //<---- Add this
      console.log("Authorization status:", authStatus);
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("Your Firebase Token is:", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  };

  return <AppContainer />;
};

export default App;
