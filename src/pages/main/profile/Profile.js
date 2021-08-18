import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Loader from '../../../components/Loader';
import { getAdStatus } from '../../../api/AdsApi';
import * as STORAGE from '../../../Storage';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import Button from '../../../components/Button';
import { useTheme } from '@react-navigation/native';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1690523413615203/3882846984';
export default function Profile({navigation}) {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false)
    const [showAds, setShowAds] = useState(false)
    const [userData, setUserData] = useState([])

    React.useEffect(()=>{
        getAdStatus((adStatus) => {
            setShowAds(adStatus.profileBannerAd)
        });

        STORAGE.getUserInfo((data)=>{
            data && setUserData(data)
        })
    },[navigation])

    const toMakeSong = () => {
        navigation.navigate("MakeSong")
    }
    
    const toMyChords = () => {
        navigation.navigate('MyChords', {
            user : userData.email ? userData.email : ''
        });
    }

    return (
        <View style={{flex:1}}>
            <Loader loading={loading} />
            <View style={{...styles.HeaderContainer, backgroundColor:colors.card, borderColor:colors.text}}>
                <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems:'center'}}>
                    { userData.photoURL ?
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={{flex:1, margin:20 }}>
                            <Image source={{uri: userData.photoURL}} style={{height: 80, width: 80, borderRadius: 40, borderColor:colors.text, borderWidth:2}}/>
                        </View>
                        <View style={{flex:3 }}>
                            <Text style={{color:colors.text, fontWeight: 'bold'}}>{userData.displayName}</Text>
                            <Text numberOfLines={2} style={{color:colors.text, fontSize:13 }}>{userData.email}</Text>
                        </View>
                    </View> :
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text numberOfLines={2} style={{color:colors.text, fontWeight: 'bold', textAlign:'center'}}>{userData.email}</Text>
                    </View>
                    }
                    
                </View>                
            </View>
            <View style={styles.ListContainer}>
                {
                    userData.email ?
                    <View style={{flex:1}}>
                        <Button name='Tulis Chord' onPress={toMakeSong} icon='create-outline' height='11%' />
                        <Button name='Chord Saya' onPress={toMyChords} icon='file-tray-full-outline' height='11%'/>
                    </View>
                    :
                    <View style={{flex:1}}>
                        <Button name='Login' onPress={()=>navigation.navigate("Login")} icon='log-in-outline' height='11%' />
                    </View>
                }
            </View>
            {
                showAds ?
                <View style={{flex:1}}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.FULL_BANNER}
                    requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                    }}
                    onAdFailedToLoad={(error)=>console.log(error)}
                />
                </View>
                :
                <View/>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    HeaderContainer : {
        flex : 2,
        justifyContent : 'center',
        width : '100%',
        height : '100%',
        padding : 20,
        borderBottomStartRadius : 30,
        borderBottomEndRadius : 30,
        marginBottom : '5%',
        borderWidth : 1
    },
    ListContainer : {
        flex : 6,
        paddingHorizontal:'5%'
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
    ButtonLogin : {
        flexDirection:'row',
        paddingHorizontal:'3%',
        marginVertical:'2%',
        marginHorizontal : '5%',
        backgroundColor:'#fff',
        borderRadius : 20,
        elevation : 10,
        height:'30%',
        width:'90%',
        justifyContent:'center',
        alignItems:'center'
    },
    icon : {
        marginHorizontal:'3%',
        fontSize: 25
    }
})