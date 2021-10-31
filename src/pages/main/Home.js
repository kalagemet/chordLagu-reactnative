import React, {useState} from 'react';
import { StatusBar, View, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getPopular, getTerbaru } from '../../api/SongDbApi';
import { getAdStatus } from '../../api/AdsApi';
import { getCategory, getCategories } from '../../api/CategoryApi';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GoogleSignin } from 'react-native-google-signin';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import { checkForUpdate } from '../../Settings';
import CategoryList from '../../components/CategoryList';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1690523413615203/2186621936';

export default function Home({navigation}) {
  const { colors } = useTheme();
  const [currentUser, setCurrentUser] = useState(null)
  const [flatListItem, setFlatlistItem] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [showAds, setShowAds] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('Top Global')
  const [query, setQuery] = useState('')
  const [initializing, setInitializing] = useState(true);
  const [contentFlex, setcontentFlex] = useState(15);

  React.useEffect(()=>{
    getCategories((data)=>{
      setCategories(data.categories)
      setCategory(data.categories[0])
    })
    STORAGE.getLocalAppVersion((version)=>{
      if(version){
        checkForUpdate(version, ()=>console.log("Newest"))
      }else{
        checkForUpdate(DeviceInfo.getVersion(), ()=>console.log("Newest"))
      }
    })
  },[])

  function onAuthStateChanged(user) {
    if(user){
      STORAGE.setLoginStatus('true', ()=>setStatus())
    }else{
      STORAGE.setLoginStatus('false', ()=>setStatus())
    }
    if (initializing) setInitializing(false);
  }

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

    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscribe; // unsubscribe on unmount
  }, [navigation])

  const setStatus = () => {
    getAdStatus((adStatus) => {
      adStatus ? setcontentFlex(13) : setcontentFlex(15)
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
  }

  React.useEffect(()=>{
    category == 'Banyak Dilihat' ? getListPopular() :
    category == 'Baru' ? getListNew() :
    getListDynamicCategory()
  }, [category])

  const getListDynamicCategory = () => {
    setRefreshing(true)
    getCategory(category,(data)=>{
      setFlatlistItem(data)
    })
    setRefreshing(false)
  }

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
    category == 'Banyak Dilihat' ? getListPopular() :
    category == 'Baru' ? getListNew() :
    getListDynamicCategory()
  }

  const toViewSong = (id) => {
    navigation.navigate('ViewSong', {
      id : id,
      user : currentUser ? currentUser.email : ''
    })
  }

  const searchSong = () => {
    query && navigation.navigate('Search', {
      query : query
    })
    setQuery('')
  }
  
  return (
    <View style={{flex:1}}>
      <StatusBar
        animated={true}
        backgroundColor={colors.card}
        barStyle={colors.text == '#FFF' ? 'light-content' : 'dark-content'}/>
      <View style={{ flex: 1, flexDirection: 'row', elevation: 20, marginHorizontal: '5%', marginTop:'3%', backgroundColor:colors.card, alignItems: 'center', borderRadius: 30 }}>
        <Ionicons name='search' color={colors.text} style={{ marginHorizontal: '5%', fontSize: 27 }} />
        <TextInput
          placeholderTextColor={colors.text}
          onEndEditing={searchSong}
          onChangeText={(text) => setQuery(text)}
          value={query}
          placeholder='Cari Chord'
          style={{ width: '75%', color:colors.text }}
        />
      </View>
      <View style={{alignItems:'center', flex:1, justifyContent:'center', padding:'3%'}}>
        <CategoryList data={categories} onPress={(data)=>setCategory(data)} current={category} />
      </View>
      <View style={{flex:contentFlex}}>
        <SongList
          songs={flatListItem} 
          onPress={(id) => toViewSong(id)}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
      {
        showAds ?
        <View style={{flex:1.5}}>
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