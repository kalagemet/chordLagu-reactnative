import React, {useState} from 'react';
import { Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getPopular } from '../../api/SongDbApi';
import { getAdStatus } from '../../api/AdsApi';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1690523413615203/2186621936';

export default function Home({navigation}) {
  const [currentUser, setCurrentUser] = useState(null)
  const [flatListItem, setFlatlistItem] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [showAds, setShowAds] = useState(false)

  React.useEffect(()=>{
    setRefreshing(true);

    getAdStatus((adStatus) => {
      setShowAds(adStatus.homeBannerAd)
    });

    getPopular((songList) => {
      setFlatlistItem(songList),
      setRefreshing(false)
    }, ()=> setRefreshing(false));

    STORAGE.getLoginStatus((value)=>{
      if(!value){
        const user = null
        setCurrentUser(user)
        STORAGE.setUserInfo(user, ()=>console.log('user skipped'))
      }else{
        const { _user } = auth()
        setCurrentUser(_user)
        if(_user){
          STORAGE.setUserInfo(_user, ()=>console.log('user logged in'))
        }
      }
    })
  }, [navigation])

  const getListSongs = () => {
    setRefreshing(true)
    getPopular((songList) => {
      setFlatlistItem(songList),
      setRefreshing(false)
    }, ()=> setRefreshing(false));
  }

  const onRefresh = () => {
    getListSongs()
  }

  const toViewSong = (e, typeApi, created_by, title) => {
    navigation.navigate('ViewSong', {
      path: e,
      type : typeApi,
      created : created_by,
      user : currentUser ? currentUser.email : '',
      title : title
    })      
  }

  const toMakeSong = () => {
    navigation.navigate("MakeSong")
  }

  
  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <View style={{alignItems:'center', flex:1}}>
        <Text style={{fontSize:20}}>Populer</Text>
      </View>
      <View style={{flex:9}}>
        <SongList 
          songs={flatListItem} 
          onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
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