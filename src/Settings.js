import React from "react";
import { Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { getSettings } from "./api/AdsApi";
import { setLocalAppVersion } from "./Storage";

export function checkForUpdate(currentVersion, isNewest) {
  getSettings((settings) => {
    if (settings.currentVersion <= currentVersion) {
      isNewest();
    } else {
      Alert.alert("Update Aplikasi", "Update ChordLagu Tersedia", [
        {
          text: "Jangan Pernah",
          onPress: () =>
            setLocalAppVersion(settings.currentVersion, () =>
              console.log("Never Pressed")
            ),
        },
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () =>
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.chordlagu"
            ),
        },
      ]);
    }
  });
}

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const getTheme = async (onReceived) => {
  let theme = await AsyncStorage.getItem("@theme");
  onReceived(theme);
};

export const setTheme = async (value, onSaved) => {
  await AsyncStorage.setItem("@theme", value).then(() => {
    onSaved();
  });
};
