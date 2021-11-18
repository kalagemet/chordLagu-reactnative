import React, {useState} from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import Loader from '../../components/Loader';
import * as STORAGE from '../../Storage';
import Button from '../../components/Button';
import InputText from '../../components/InputText';
import { useTheme } from '@react-navigation/native';

export default function Login({ navigation }) {
    const { colors } = useTheme();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const skipLogin = async () => {
        STORAGE.setLoginStatus('false', () => {
            navigation.navigate('Main')
        })
        STORAGE.setUserInfo(null, ()=>{
            console.log('skip pressed')
        })
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
            STORAGE.setLoginStatus('true', () => {
                setTimeout(()=>{
                    navigation.reset({routes:[{name:'Main'}]})
                }, 1000)
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
        if(email=='' || password==''){
            setErrorMessage('Email dan password tidak boleh kosong')
        }else{
            setLoading(true)
            auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoading(false)
                STORAGE.setLoginStatus('true', () => {
                    setTimeout(()=>{
                        navigation.reset({routes:[{name:'Main'}]})
                    }, 1000)
                })
            })
            .catch(error => {setErrorMessage(error.message), setLoading(false)})
        }
    }

    const toSignup = () => {
        navigation.navigate('Signup')
    }

    return (
        <View style={styles.Container}>
            <Loader loading={loading} />
            <View style={styles.HeaderContainer}>
                <Image source={require('../../assets/Images/chordlagu.png')} style={{width: 80, height: 80}} resizeMode='contain'/>
                <Text style={{...styles.TextA, color:colors.text}}>Chord Lagu</Text> 
            </View>
            <View style={styles.FormContainer}>
                {errorMessage &&
                <Text style={{ color: colors.notification, textAlign:'center', padding:10}}>
                {errorMessage}
                </Text>}
                <InputText name='Email' onChangeText={(text) => setEmail(text)}/>
                <InputText secure name='Password' onChangeText={(text) => setPassword(text)} />

                <View style={{margin:'3%'}}/>

                <Button name='Login' onPress={handleLogin} height='11%'/>
                <Button name='Daftar' onPress={toSignup} height='11%'/>

                <View style={{paddingVertical:10, alignItems:'center'}}>
                    <Text style={{color: colors.text}}>Atau</Text>
                </View>

                <Button name='Masuk Dengan Google' icon='logo-google' onPress={_signIn} height='11%'/>

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

