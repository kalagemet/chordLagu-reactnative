/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import admob, { MaxAdContentRating } from "@react-native-firebase/admob";
import messaging from "@react-native-firebase/messaging";
import * as STORAGE from "./src/Storage";

admob()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,
  })
  .then(() => {
    // Request config successfully set!
  });

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
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

AppRegistry.registerComponent(appName, () => App);
