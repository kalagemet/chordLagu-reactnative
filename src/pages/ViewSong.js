import React, {useState} from 'react';
import { Container, Text, Icon, View, Toast } from 'native-base';
import { StyleSheet, Button, Alert, ScrollView} from 'react-native';
import RenderSong from '../components/RenderSong';
import Slider from '@react-native-community/slider';
import { deleteSong, addToFavourite, removeFavourite, isFavourited } from '../api/SongsApi';
import {getStreamsBySearch} from '../api/StreamsApi';
import StreamList from '../components/StreamList';
import BottomSheet from 'reanimated-bottom-sheet';
import StreamModal from '../components/StreamModal';

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
    }
    getStreamsBySearch(title, (streamsList) => {
      setStreamsList(streamsList)
    })
  },[navigation])

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
    Toast.show({
      text: "Dihapus dari Favorit",
      buttonText: "Okay",
      position: "top"
    })
    setFavourited(false)
    setLoading(false)
  }

  const onFavouriteComplete= () => {
    Toast.show({
      text: "Disimpan di Favorit",
      buttonText: "Okay",
      position: "top"
    })
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
    Toast.show({
      text: "Berhasil dihapus",
      buttonText: "Okay",
      position: 'bottom'
    })
    navigation.pop();
  }

  const onPressStream = (id) => {
    setStreamId(id)
    setShowStream(true)
  }

  const closeStream = () => {
    setShowStream(false)
  }

  const renderDrawer = () => {
    return (
      <View style={{height:'100%', backgroundColor:'#fff', borderTopStartRadius:20, borderTopEndRadius:20, borderWidth:2, borderBottomWidth:0, borderColor:'#000'}}>
        <View style={{height:'1.5%', width:'20%', backgroundColor:'#000', borderRadius:5, marginVertical:10, alignSelf:'center'}}></View>
        <View style={styles.container}>
          {
              scrollActive ?
              <Icon name="pause" onPress={stop}/> :
              <Icon name="play" onPress={start}/>
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
              <Icon style={{color:'#ccc', backgroundColor:'#000', borderRadius:3}} onPress={transposeDown} type="AntDesign" size={3} name="minus"/>
              <Text style={{fontSize:11, alignSelf:'center', marginHorizontal:'3%' }}>Nada: {(transpose+12) >=0 ? `+${transpose+12}` : transpose+12}</Text>
              <Icon style={{color:'#ccc', backgroundColor:'#000', borderRadius:3}} onPress={transposeUp} type="AntDesign" size={3} name="plus"/>
            </View>
            {
              user == created_by ?
              <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                <Icon name="heart" style={{fontSize : 27, marginHorizontal : 10, color : favourited?'red':'#000'}} onPress={onClickFavourite}/>
                <Icon name="edit" type="MaterialIcons" style={{fontSize : 27, marginHorizontal : 10, color : '#000'}} onPress={toEditSong}/> 
                <Icon name="trash" style={{fontSize : 27, marginHorizontal : 10, color : '#000', justifyContent:'flex-end'}} onPress={onDeleteSong}/> 
              </View>
              :
              <View style={{flexDirection:'row', justifyContent:'flex-end', flex:1}}>
                {(typeAPI == 'localAPI' && user != 'anonim' ) && <Icon name="heart" style={{fontSize : 32, marginHorizontal : 10, color : favourited?'red':'#ccc', marginRight:10}} onPress={onClickFavourite}/>}
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
    <Container>
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
          snapPoints={['40%', '40%', '10%']}
          renderContent={renderDrawer}
          initialSnap={2}
          enabledContentTapInteraction={false}
      />
    </Container>
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