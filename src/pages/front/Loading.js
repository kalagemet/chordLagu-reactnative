// Loading.js
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from 'react-native-google-signin';
import SplashScreen from 'react-native-splash-screen';
import * as STORAGE from '../../Storage';

function Loading({ navigation }) {

  React.useEffect(()=>{
    SplashScreen.hide();
      GoogleSignin.configure({
        //It is mandatory to call this method before attempting to call signIn()
        scopes: [],
        offlineAccess: true,
        // Repleace with your webClientId generated from Firebase console
        webClientId:
          '116192262171-6ehlf2kdqo4qiq6vn81k1tppdsqls6vi.apps.googleusercontent.com',
      });

      auth().onAuthStateChanged(user => {
        if(user){
          navigation.reset({routes:[{name:'Home'}]})
        }else{
          STORAGE.getLoginStatus((value)=>{
            if(value == 'skip'){
              navigation.reset({routes:[{name:'Home'}]})
            }
            else {
              navigation.reset({routes:[{name:'Login'}]})
            }
          })
        }
      })
  }, [navigation])

  return (
    <View style={styles.container}>
      <Text style={{fontSize:20}}>Chord Lagu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Loading;