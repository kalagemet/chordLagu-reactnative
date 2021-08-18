import React from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { PreferencesContext } from '../../../Settings';
import Button from '../../../components/Button';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import * as STORAGE from '../../../Storage';

export default function Setting({navigation}){
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const [login, setLogin] = React.useState(false)

    React.useEffect(()=>{
        STORAGE.getLoginStatus((status) => {
            setLogin(status)
        })
    },[navigation])

    const alert_ = () => {
        Alert.alert(
            'Logout',
            'Keluar Dari Akun',
            [
            {
                text: 'Batal',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
              {text: 'Ya', onPress: signOut},
            ],
            {cancelable: false},
        );
    }

    const signOut = async () => {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
            auth()
            .signOut()
            .then(() => {
                navigation.reset({routes:[{name:'Loading'}]})
            })
            .catch(function() {
            // An error happened.
          });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
              auth()
              .signOut()
              .then(() => {
                navigation.reset({routes:[{name:'Loading'}]})
                })
              .catch(function() {
              // An error happened.
            });
          } else {
            // some other error
          }
        }
    };

    return(
        <View style={{flex:1}}>
            <View style={{flex:1, padding:'5%', alignItems:'flex-start', flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color: isThemeDark ? '#FFF' : '#000'}}>Mode Gelap</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isThemeDark ? "#222831" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isThemeDark}
                />
            </View>
            <View style={{flex:3, justifyContent:'flex-end', padding:'5%'}}>
                {
                    login ?
                    <Button name='Logout' onPress={alert_} icon='log-out-outline' height='11%' />
                    :
                    <Button name='Login' onPress={()=>navigation.navigate("Login")} icon='log-in-outline' height='11%' />                    
                }
            </View>
        </View>
    )
}