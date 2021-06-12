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
        <Container>
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
                        <Button light style={styles.Button} onPress={toMakeSong}>
                            <Icon type='FontAwesome' name='edit'/>
                            <Text>Tulis Chord</Text>
                        </Button>
                        <Button light style={styles.Button} onPress={toMyChords}>
                            <Icon type="FontAwesome5" name="guitar"/>
                            <Text>Chord Saya</Text>
                        </Button>
                        <Button light style={styles.Button} onPress={alert_}>
                            <Icon type='FontAwesome' name='sign-out'/>
                            <Text>Logout</Text>
                        </Button>
                    </View>
                    :
                    <View>
                        <TouchableOpacity style={styles.Button} onPress={toLogin}>
                            <Text>Login</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            
        </Container>
    );
}

const styles = StyleSheet.create({
    HeaderContainer : {
        flex : 1,
        justifyContent : 'center',
        width : '100%',
        height : '100%',
        padding : 20,
        backgroundColor : '#58595b'
    },
    ListContainer : {
        flex : 3,
    },
    Button : {
        backgroundColor:'#ccc',
        height:'20%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    TextA : {
        fontSize : 28,
        textAlign : "center",
        padding : 20
    }
})