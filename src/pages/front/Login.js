import React, {useState} from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import Loader from '../../components/Loader';
import * as STORAGE from '../../Storage';
import Button from '../../components/Button';
import InputText from '../../components/InputText';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const skipLogin = async () => {
        STORAGE.setLoginStatus('skip', () => {
            navigation.navigate('Home')
        })
        STORAGE.setUserInfo(null)
    }

    const _signIn = async () => {
        //Prompts a modal to let the user sign in into your application.
        try {
            await GoogleSignin.hasPlayServices({
                //Check if device has Google Play Services installed.
                //Always resolves to true on iOS.
                showPlayServicesUpdateDialog: true,
            });
            const user = await GoogleSignin.signIn()
            const credential = auth.GoogleAuthProvider.credential(user.idToken, user.accessToken)
            // login with credential
            const firebaseUserCredential = await auth().signInWithCredential(credential)
            STORAGE.setLoginStatus('login', () => {
                navigation.navigate('Home')
            })
        } catch (error) {
            setLoading(false)
          console.log('Message', error.message);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User Cancelled the Login Flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Signing In');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services Not Available or Outdated');
          } else {
            console.log('Some Other Error Happened');
          }
        }
    };

    const handleLogin = () => {
        STORAGE.setLoginStatus('login', () => {
            if(email=='' || password==''){
                setErrorMessage('Email dan password tidak boleh kosong')
            }else{
                setLoading(true)
                auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    setLoading(false)
                    STORAGE.setLoginStatus('login', () => {
                        navigation.navigate('Home')
                    })
                })
                .catch(error => {setErrorMessage(error.message), setLoading(false)})
            }
        })
    }

    const toSignup = () => {
        navigation.navigate('Signup')
    }

    return (
        <View style={styles.Container}>
            <Loader loading={loading} />
            <View style={styles.HeaderContainer}>
                <Image source={require('../../assets/Images/chordlagu.png')} style={{width: 80, height: 80}} resizeMode='contain'/>
                <Text style={styles.TextA}>Chord Lagu</Text> 
            </View>
            <View style={styles.FormContainer}>
                {errorMessage &&
                <Text style={{ color: 'red', textAlign:'center', padding:10}}>
                {errorMessage}
                </Text>}
                <InputText name='Email' onChangeText={(text) => setEmail(text)}/>
                <InputText secure name='Password' onChangeText={(text) => setPassword(text)} />

                <View style={{margin:'3%'}}/>

                <Button name='Login' onPress={handleLogin}/>
                <Button name='Daftar' onPress={toSignup}/>

                <View style={{paddingVertical:10, alignItems:'center'}}>
                    <Text>Atau</Text>
                </View>

                <Button name='Masuk Dengan Google' icon='logo-google' onPress={_signIn}/>

                <View style={{paddingVertical:20, alignItems:'center'}}>
                    <Text style={{fontWeight:'bold', color:'grey'}}
                    onPress={skipLogin}>Lewati</Text>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    Container : {
        flex: 1
    },
    HeaderContainer : {
        flex : 1.7,
        alignItems : 'center',
        justifyContent : 'center',
        width : '100%',
        height : '100%'
    },
    FormContainer : {
        flex : 3,
        padding : '5%'
    },
    Button : {
        flexDirection :'row',
        alignItems:'center',
        justifyContent :'center'
    },
    TextA : {
        fontSize : 28,
        textAlign : "center",
        padding : '5%'
    }
})

