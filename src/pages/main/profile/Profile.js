import { Button, Container, Icon, Text, View } from 'native-base';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import Loader from '../../../components/Loader';
import { getAdStatus } from '../../../api/AdsApi';
import * as STORAGE from '../../../Storage';

export default function Profile({navigation}) {
    const [loading, setLoading] = useState(false)
    const [showAds, setShowAds] = useState(false)
    const [userData, setUserData] = useState([])

    React.useEffect(()=>{
        getAdStatus((adStatus) => {
            setShowAds(adStatus.profileBannerAd)
        });

        STORAGE.getUserInfo((data)=>{
            data && setUserData(data)
            console.log(data)
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
        setLoading(true)
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
            auth()
            .signOut()
            .then(() => {
                setLoading(false)
                navigation.reset({routes:[{name:'Login'}]})
            })
            .catch(function() {
            // An error happened.
          });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
              auth()
              .signOut()
              .then(() => {
                setLoading(false)
                navigation.reset({routes:[{name:'Login'}]})
                })
              .catch(function() {
              // An error happened.
            });
          } else {
            // some other error
          }
        }
    };

    const toMakeSong = () => {
        navigation.navigate("MakeSong")
    }

    const toLogin = () => {
        navigation.navigate("Login")
    }

    const toMyChords = () => {
        navigation.navigate('MyChords', {
            user : userData.email ? userData.email : ''
        });
    }

    return (
        <View style={{flex:1, backgroundColor:'#fff'}}>
            <Loader loading={loading} />
            <View style={styles.HeaderContainer}>
                <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems:'center'}}>
                    { userData.photo ?
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={{flex:1, margin:20 }}>
                            <Image source={{uri: userData.photo}} style={{height: 80, width: 80, borderRadius: 40}}/>
                        </View>
                        <View style={{flex:3 }}>
                            <Text style={{color:'white', fontWeight: 'bold'}}>{userData.name}</Text>
                            <Text numberOfLines={2} style={{color:'white', fontSize:13 }}>{userData.email}</Text>
                        </View>
                    </View> :
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text numberOfLines={2} style={{color:'white', fontWeight: 'bold', textAlign:'center'}}>{userData.email}</Text>
                    </View>
                    }
                    
                </View>                
            </View>
            <View style={styles.ListContainer}>
                {
                    userData.email ?
                    <View>
                        <TouchableOpacity light style={styles.Button} onPress={toMakeSong}>
                            <Icon style={styles.icon} type='FontAwesome' name='edit'/>
                            <Text>Tulis Chord</Text>
                        </TouchableOpacity>
                        <TouchableOpacity light style={styles.Button} onPress={toMyChords}>
                            <Icon style={styles.icon} type="FontAwesome5" name="guitar"/>
                            <Text>Chord Saya</Text>
                        </TouchableOpacity>
                        <TouchableOpacity light style={styles.Button} onPress={alert_}>
                            <Icon style={styles.icon} type='FontAwesome' name='sign-out'/>
                            <Text>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        <TouchableOpacity style={styles.Button} onPress={toLogin}>
                            <Text>Login</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    HeaderContainer : {
        flex : 1,
        justifyContent : 'center',
        width : '100%',
        height : '100%',
        padding : 20,
        backgroundColor : '#000',
        borderBottomStartRadius : 30,
        borderBottomEndRadius : 30,
        elevation: 40,
        marginBottom : '5%'
    },
    ListContainer : {
        flex : 3,
    },
    Button : {
        flexDirection:'row',
        paddingHorizontal:'3%',
        marginVertical:'2%',
        marginHorizontal : '5%',
        backgroundColor:'#fff',
        borderRadius : 20,
        elevation : 10,
        height:'17%',
        width:'90%',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    icon : {
        marginHorizontal:'3%'
    }
})