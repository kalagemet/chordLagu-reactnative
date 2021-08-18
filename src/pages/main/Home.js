import React, {useState} from 'react';
import { StatusBar, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getPopular, getTerbaru } from '../../api/SongDbApi';
import { getAdStatus } from '../../api/AdsApi';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { useTheme } from '@react-navigation/native';
import Button from '../../components/Button';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1690523413615203/2186621936';

export default function Home({navigation}) {
  const { colors } = useTheme();
  const [currentUser, setCurrentUser] = useState(null)
  const [flatListItem, setFlatlistItem] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [showAds, setShowAds] = useState(false)
  const [category, setCategory] = useState('popular')

  React.useEffect(()=>{
    setRefreshing(true);

    getAdStatus((adStatus) => {
      setShowAds(adStatus.homeBannerAd)
    });

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

  React.useEffect(()=>{
    category == 'popular' ?
      getListPopular() :
      getListNew()
  }, [category])

  const getListPopular = () => {
    setRefreshing(true)
    getPopular((songList) => {
      setFlatlistItem(songList),
      setRefreshing(false)
    }, ()=> setRefreshing(false));
  }

  const getListNew = () => {
    setRefreshing(true)
    getTerbaru((songList) => {
      setFlatlistItem(songList),
      setRefreshing(false)
    }, ()=> setRefreshing(false));
  }

  const onRefresh = () => {
    category == 'popular' ?
      getListPopular() :
      getListNew()
  }

  const toViewSong = (id) => {
    navigation.navigate('ViewSong', {
      id : id,
      user : currentUser ? currentUser.email : ''
    })
  }

  const toMakeSong = () => {
    navigation.navigate("MakeSong")
  }

  
  return (
    <View style={{flex:1}}>
      <StatusBar
        animated={true}
        backgroundColor={colors.card}
        barStyle={colors.text == '#FFF' ? 'light-content' : 'dark-content'}/>
      <View style={{alignItems:'center', flex:1, justifyContent:'center', padding:'3%', flexDirection:'row'}}>
        <Button name='Populer' height='80%' width='25%' onPress={()=>setCategory('popular')} disabled={category == 'popular' ? true : false} />
        <View style={{width:'5%'}} />
        <Button name='Baru' height='80%' width='25%' onPress={()=>setCategory('new')} disabled={category == 'new' ? true : false}/>
      </View>
      <View style={{flex:15}}>
        <SongList 
          songs={flatListItem} 
          onPress={(id) => toViewSong(id)}
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