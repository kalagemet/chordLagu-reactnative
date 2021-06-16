import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false
});

export const getTheme = async(onReceived) => {
  let theme = await AsyncStorage.getItem('@theme')
  onReceived(theme)
}

export const setTheme = async(value, onSaved) => {
  await AsyncStorage.setItem('@theme', value)
  .then(()=>{
      onSaved()
  })
}