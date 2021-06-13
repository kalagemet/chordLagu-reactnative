import React, {useState} from 'react';
import { StyleSheet, Alert, ToastAndroid, Text, View, BackHandler } from 'react-native';
import RenderSong from '../components/RenderSong';
import Slider from '@react-native-community/slider';
import { deleteSong, addToFavourite, removeFavourite, isFavourited } from '../api/SongsApi';
import {getStreamsBySearch} from '../api/StreamsApi';
import StreamList from '../components/StreamList';
import BottomSheet from 'reanimated-bottom-sheet';
import StreamModal from '../components/StreamModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { getSongContent } from '../api/SongDbApi';
import * as STORAGE from '../Storage';

export default function ViewSong({navigation, route}){

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [transpose, setTranspose] = useState(-12)
  const [scrollActive, setScrollActive] = useState(false)
  const [sliderValue, setSliderValue] = useState(0.5)
  const [jsRun, setJsRun] = useState(``)
  const [favourited, setFavourited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [streamsList, setStreamsList] = useState([])
  const [showStream, setShowStream] = useState(false)
  const [streamId, setStreamId] = useState('')
  const songPath = route.params.path
  const typeAPI = route.params.type
  const created_by = route.params.created
  const user = route.params.user
  const title = route.params.title
  const sheetRef = React.useRef(null);

  React.useEffect(()=>{
    console.log("created BY : "+created_by)
    if(typeAPI == 'localAPI' && user != 'anonim'){
      isFavourited(songPath, user, (fav) => {
        console.log("fav : " +fav)
        setFavourited(fav)
      })
    }else if(typeAPI == 'downloaded'){
      setFavourited(true)
    }
    getStreamsBySearch(title, (streamsList) => {
      setStreamsList(streamsList)
    })
  },[navigation])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showStream) {
          closeStream()
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [showStream, closeStream])
  );

  const openSideMenu = () => { setIsSideMenuOpen(!isSideMenuOpen) }

  const transposeUp = () => {
    if(transpose < 0){
      setTranspose(transpose + 1)
    }
  }

  const transposeDown = () => {
    if(transpose > -24){
      setTranspose(transpose - 1)
    }
  }

  const handelSliderChange = (value) =>{
    setSliderValue(value)
    setScrollActive(true)
    if (value <= 0) {
      setJsRun(`
      if(window.intervalId) {
        clearInterval(window.intervalId);
      }
      true;
      `)
    } else {
      setJsRun(`
      function pageScroll(){
        window.scrollBy(0,1);
      }
      if(window.intervalId) {
        clearInterval(window.intervalId);
      }
      window.intervalId = setInterval(pageScroll, ${(1 - value) * 300 + 10});
      true;
      `)
    }
  }
  
  const start = () => {
    setScrollActive(true)
    handelSliderChange(sliderValue)
  }
  
  const stop = () => {
    setScrollActive(false)
    setJsRun(`
    if(window.intervalId) {
      clearInterval(window.intervalId);
    }
    true;
    `)
  }


  const onClickFavourite = () => {
    setLoading(true)

    if(favourited){
      removeFavourite(user, songPath, onRemovedFavourite)
    }else{
      let favourite = {
        user : user,
        songId : songPath
      }
      addToFavourite(favourite, onFavouriteComplete)
    }
  }

  const onRemovedFavourite = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Dihapus dari Favorit",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    )
    setFavourited(false)
    setLoading(false)
  }

  const onFavouriteComplete= () => {
    ToastAndroid.showWithGravityAndOffset(
      "Disimpan di Favorit",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    )
    setFavourited(true)
    setLoading(false)
  }

  const toEditSong = () => {
    navigation.navigate('EditSong', {
      path: songPath
    });
  }

  const onDeleteSong = () => {
    Alert.alert(
        'Hapus',
        'Hapus Lagu ?',
        [
        {
            text: 'Batal',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
          {text: 'Ya', onPress: () => _delete()}
        ],
        {cancelable: false},
    );
    
  }

  const _delete = () => {
    setLoading(true)
    deleteSong(songPath, onCompleteDelete)
  } 

  const onCompleteDelete = () => {
    setLoading(false)
    ToastAndroid.showWithGravityAndOffset(
      "Berhasil Dihapus",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    )
    navigation.pop();
  }

  const onPressStream = (id) => {
    setStreamId(id)
    setShowStream(true)
  }

  const closeStream = () => {
    setShowStream(false)
  }

  const onClickDownload = () => {
    setLoading(true)
    if(favourited){
      STORAGE.deleteSaved(songPath, ()=>{
        setFavourited(false)
        setLoading(false)
        ToastAndroid.showWithGravityAndOffset(
          "Berhasil Dihapus dari Favorit",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        )
      })
    }else{
      getSongContent(songPath, (data)=>{
        STORAGE.saveSong(data, ()=>{
          setFavourited(true)
          setLoading(false)
          ToastAndroid.showWithGravityAndOffset(
            "Berhasil Disimpan di Favorit",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          )
        })
      })
    }
  }

  const renderDrawer = () => {
    return (
      <View style={{height:'100%', backgroundColor:'#fff', borderTopStartRadius:20, borderTopEndRadius:20, borderWidth:1, borderBottomWidth:0, borderColor:'#000'}}>
        <View style={{height:'1.5%', width:'20%', backgroundColor:'#000', borderRadius:5, marginTop:10, alignSelf:'center'}}></View>
        <View style={styles.container}>
          {
              scrollActive ?
              <Ionicons size={25} name="pause" onPress={stop}/> :
              <Ionicons size={25}  name="play" onPress={start}/>
          }
          <Slider
              style={{ flex: 1, marginHorizontal: 20}}
              value={sliderValue}
              onValueChange={(sliderValue) => handelSliderChange(sliderValue)}
              minimumValue={0}
              maximumValue={1}
          />
          <Text>{sliderValue.toFixed(2)} x</Text>
        </View>
        <View style={styles.tool}>
            <View style={{flex:1, flexDirection:'row', marginHorizontal:'5%'}}>
              <Ionicons size={30}  style={{color:'#ccc', backgroundColor:'#000', borderRadius:3}} onPress={transposeDown} name="remove"/>
              <Text style={{fontSize:11, alignSelf:'center', marginHorizontal:'3%' }}>Nada: {(transpose+12) >=0 ? `+${transpose+12}` : transpose+12}</Text>
              <Ionicons size={30}  style={{color:'#ccc', backgroundColor:'#000', borderRadius:3}} onPress={transposeUp} name="add"/>
            </View>
            {
              user == created_by ?
              <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                <Ionicons name="heart" style={{fontSize : 30, marginHorizontal : 10, color : favourited?'red':'#000'}} onPress={onClickFavourite}/>
                <Ionicons name="create" style={{fontSize : 30, marginHorizontal : 10, color : '#000'}} onPress={toEditSong}/> 
                <Ionicons name="trash" style={{fontSize : 30, marginHorizontal : 10, color : '#000', justifyContent:'flex-end'}} onPress={onDeleteSong}/> 
              </View>
              :
              <View style={{flexDirection:'row', justifyContent:'flex-end', flex:1}}>
                {(typeAPI == 'localAPI' && user != 'anonim' ) && <Ionicons name="heart" style={{fontSize : 30, marginHorizontal : 10, color : favourited?'red':'#000', marginRight:10}} onPress={onClickFavourite}/>}
                { (typeAPI == 'desalase' || typeAPI == 'downloaded')  && <Ionicons name="heart" style={{fontSize : 30, marginHorizontal : 10, color : favourited?'red':'#000', marginRight:10}} onPress={onClickDownload}/>}
              </View>
            }
        </View>
        <View style={{height:'50%'}}>
          {
            showStream ?
            <StreamModal
              showStream = {showStream}
              closeModalStream = {closeStream}
              id = {streamId}
            />
            :
            <StreamList streams={streamsList} onPress={onPressStream}/>
          }
        </View>
      </View>
    )
  }

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
        <View style={{height:'91%'}}>
            <RenderSong 
              openSideMenu={openSideMenu} 
              songPath={songPath}
              typeAPI={typeAPI}
              transpose={transpose}
              jsRun={jsRun}
            />
        </View>
        <BottomSheet
          ref={sheetRef}
          snapPoints={['40%', '40%', '8%']}
          renderContent={renderDrawer}
          initialSnap={2}
          enabledContentTapInteraction={false}
      />
    </View>
  );
    
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '7%',
    paddingHorizontal:'5%'
  },
  tool: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    marginVertical:'5%'
  }
})