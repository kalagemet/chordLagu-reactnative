import React, {useState} from 'react';
import { Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getPopular } from '../../api/SongDbApi';
import { getAdStatus } from '../../api/AdsApi';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';

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
    });

    STORAGE.getLoginStatus((value)=>{
      if(value == 'skip'){
        const user = null
        setCurrentUser(user)
        STORAGE.setUserInfo(user, ()=>console.log('user skipped'))
      }else{
        const { _user } = auth()
        setCurrentUser(_user)
        if(currentUser){
          STORAGE.setUserInfo(currentUser, ()=>console.log('user logged in'))
        }
        STORAGE.getUserInfo((data)=>console.log(data))
      }
    })
  }, [navigation])

  const getListSongs = () => {
    setRefreshing(true)
    getPopular(onSongsReceived);
  }

  const onRefresh = () => {
    getListSongs()
  }

  const toViewSong = (e, typeApi, created_by, title) => {
    navigation.navigate('ViewSong', {
      path: e,
      type : typeApi,
      created : created_by,
      user : currentUser ? currentUser.email : 'anonim',
      title : title
    })      
  }

  const toMakeSong = () => {
    navigation.navigate("MakeSong")
  }

  
  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <View style={{alignItems:'center', padding:'3%'}}>
        <Text style={{fontSize:25}}>Populer</Text>
      </View>
        <SongList songs={flatListItem} onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)}/>
      <View>
        {/* { currentUser ?
        <Fab
          active={true}
          direction="up"
          containerStyle={{ }}
          style={{ backgroundColor: '#58595b' }}
          position="bottomRight"
          onPress={toMakeSong}>
          <Icon name="add" />
        </Fab>
        : <View/>
        } */}
      </View>
      {
        showAds ?
        <Banner
        unitId={unitId}
        size={'SMART_BANNER'}
        request={request.build()}
        onAdLoaded={() => {
            console.log('Advert loaded');
        }}
        onAdFailedToLoad={(error) => {
            console.log('Advert fail');
            console.log(error.code);
            console.log(error.message);
        }}
        />
        :
        <View/>
      }
    </View>
  );
    
}