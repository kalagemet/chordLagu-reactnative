import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Alert, ToastAndroid, Text, View, BackHandler } from 'react-native';
import Slider from '@react-native-community/slider';
import { deleteSong, addToFavourite, removeFavourite, isFavourited, getSong } from '../api/SongsApi';
import { getStreamsBySearch } from '../api/StreamsApi';
import StreamList from '../components/StreamList';
import BottomSheet from '@gorhom/bottom-sheet';
import StreamModal from '../components/StreamModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { getSongContent } from '../api/SongDbApi';
import * as STORAGE from '../Storage';
import { useTheme } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { decode } from '../utils/decode';
import chords from '../assets/chords/guitar.json';
import ChordModal from '../components/ChordModal';
import { capoDown, capoUp } from '../utils/capo';
import Loader from '../components/Loader';

export default function ViewSong({ navigation, route }) {
  const { colors } = useTheme();
  const [transpose, setTranspose] = useState(0)
  const [scrollActive, setScrollActive] = useState(false)
  const [sliderValue, setSliderValue] = useState(0.5)
  const [jsRun, setJsRun] = useState(``)
  const [favourited, setFavourited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [streamsList, setStreamsList] = useState([])
  const [showStream, setShowStream] = useState(false)
  const [streamId, setStreamId] = useState('')
  const [content, setContent] = useState('')
  const [chordName, setChordName] = useState('')
  const [showChord, setShowChord] = useState(false)
  const [selectedChord, setSelectedChord] = useState('')
  const [fontSize, setFontSize] = useState(15)
  const songPath = route.params.path
  const created_by = route.params.created
  const user = route.params.user
  const title = route.params.title
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['5%', '35%'], []);
  const webViewRef = useRef();
  
  React.useEffect(() => {
    console.log("created BY : " + created_by)
    setLoading(true)
    getContent()
    checkIfDownloaded()
    getStreamsBySearch(title, (streamsList) => {
      setStreamsList(streamsList)
    })
  }, [navigation])

  React.useEffect(()=>{
    !loading && webViewRef.current.injectJavaScript(jsRun);
  })

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

  const checkIfDownloaded = () => {
    STORAGE.getSavedSong(songPath, (item) => {
      if (item && item.id == songPath) {
        setFavourited(true)
      }
    })
  }

  const getContent = () => {
    getSongContent(songPath, (data)=>{
      setContent(decode(data.isi))
      setLoading(false)
    })
  }

  const transposeUp = () => {
    setContent(capoUp(content))
    setTranspose(transpose+1)
  }

  const transposeDown = () => {
    setContent(capoDown(content))
    setTranspose(transpose-1)
  }

  const handelSliderChange = (value) => {
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

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    )
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
        { text: 'Ya', onPress: () => _delete() }
      ],
      { cancelable: false },
    );

  }

  const _delete = () => {
    setLoading(true)
    deleteSong(songPath, () => {
      setLoading(false)
      showToast("Berhasil Dihapus")
      navigation.pop();
    })
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
    if (favourited) {
      STORAGE.deleteSaved(songPath, () => {
        setFavourited(false)
        setLoading(false)
        showToast("Berhasil Dihapus dari Favorit")
      })
    } else {
      getSongContent(songPath, (data) => {
        STORAGE.saveSong(data, () => {
          setFavourited(true)
          setLoading(false)
          showToast("Berhasil Disimpan di Favorit")
        })
      })
    }
  }

  const handleMessage = (selectedChord) => {
    if (chords[selectedChord.toString()]){
      let chord = chords[selectedChord.toString()][0].positions
      setChordName(selectedChord.toString())
      setSelectedChord(chord)
      setShowChord(true)
    }
    
  }

  const drawerHandler = () => {
    return(
      <View style={{
        backgroundColor:colors.background, 
        height:30, 
        borderTopStartRadius:15, 
        borderTopEndRadius:15, 
        justifyContent:'center'
      }}>
        <View style={{ height: '20%', width: '20%', backgroundColor:colors.text, borderRadius: 5, alignSelf: 'center' }}></View>
      </View>
    )
  }

  const renderDrawer = () => {
    return (
      <View style={{...styles.bottomSheetContainer, backgroundColor:colors.background}}>
        <View style={styles.scroll}>
          {
            scrollActive ?
              <Ionicons color={colors.primary} size={25} name="pause" onPress={stop} /> :
              <Ionicons color={colors.primary} size={25} name="play" onPress={start} />
          }
          <Slider
            thumbTintColor={colors.notification}
            minimumTrackTintColor={colors.notification}
            style={{ flex: 1, marginHorizontal: 20}}
            value={sliderValue}
            onValueChange={(sliderValue) => handelSliderChange(sliderValue)}
            minimumValue={0}
            maximumValue={1}
          />
          <Text style={{color:colors.primary}}>{sliderValue.toFixed(2)} x</Text>
        </View>
        <View style={styles.tool}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Ionicons size={30} style={{ color: colors.card, backgroundColor: colors.primary, borderRadius: 3 }} onPress={transposeDown} name="remove" />
            <Text style={{ fontSize: 11, alignSelf: 'center', marginHorizontal: '3%', color:colors.text }}>Nada: {transpose>0 ? '+'+transpose: transpose==0 ? transpose: '-'+transpose}</Text>
            <Ionicons size={30} style={{ color: colors.card, backgroundColor: colors.primary, borderRadius: 3 }} onPress={transposeUp} name="add" />
            <Ionicons size={30} style={{ color: colors.card, backgroundColor: colors.primary, borderRadius: 3, marginLeft:'5%'}} onPress={()=>setFontSize(fontSize-1)} name="remove" />
            <Ionicons size={20} style={{ color: colors.text, alignSelf: 'center', marginHorizontal: '3%'}} name="text-outline" />
            <Ionicons size={30} style={{ color: colors.card, backgroundColor: colors.primary, borderRadius: 3 }} onPress={()=>setFontSize(fontSize+1)} name="add" />
          </View>
          {
            user == created_by ?
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                <Ionicons name="heart" style={{ fontSize: 30, marginHorizontal: 10, color: favourited ? '#F05454' : '#ccc' }} onPress={onClickDownload} />
                <Ionicons name="create" style={{ fontSize: 30, marginHorizontal: 10, color: colors.primary }} onPress={() => navigation.navigate('EditSong', { path: songPath })} />
                <Ionicons name="trash" style={{ fontSize: 30, marginHorizontal: 10, color: colors.primary, justifyContent: 'flex-end' }} onPress={onDeleteSong} />
              </View>
              :
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                <Ionicons name="heart" style={{ fontSize: 30, color: favourited ? '#F05454' : '#ccc' }} onPress={onClickDownload} />
              </View>
          }
        </View>
        <View style={{ height: '60%' }}>
          {
            showStream ?
              <StreamModal
                showStream={showStream}
                closeModalStream={closeStream}
                id={streamId}
              />
              :
              <StreamList streams={streamsList} onPress={onPressStream} />
          }
        </View>
      </View>
    )
  }

  return (
    loading ?
    <Loader loading={true} />
    :
    <View style={{ flex: 1}}>
      <ChordModal
        show={showChord}
        name={chordName}
        selectedChord={selectedChord}
        closeModal = {()=>setShowChord(false)}
      />
      <View style={{ height: '91%' }}>
        <WebView 
          ref={webViewRef}
          source={{ html: 
            `<html>
              <head>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                ${title}
              </head>
              <body>${content}</body>
              <style> 
                body {
                  color:${colors.text};
                  font-size: ${fontSize}px;
                }
                .chord {
                  color:${colors.notification};
                }
              </style>
            </html>` 
          }}
          injectedJavaScript={onClickChordPostMessage}
          onMessage = {(event)=> handleMessage(event.nativeEvent.data)}
          javaScriptEnabled = {true}
          style={{margin:0, padding:0, backgroundColor:colors.background}}
          scalesPageToFit={false}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enableContentPanningGesture={false}
        children={renderDrawer}
        handleComponent={drawerHandler}
        style={{
          elevation: 50,
          borderColor:colors.text,
          borderWidth:2,
          borderTopStartRadius:17,
          borderTopEndRadius:17
        }}
      />
    </View>
  );

}
const onClickChordPostMessage = `
(
  function() {
    function onClickChord (chord) {
      return function () {
        window.ReactNativeWebView.postMessage(chord)
      }
    }
    var anchors = document.getElementsByClassName('chord');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        var chord = anchor.innerText || anchor.textContent;
        anchor.onclick = onClickChord(chord)
    }
  }
)();

true;
`
const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex:1,
    justifyContent:'space-between'
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:'5%',
    marginBottom:'2%'
  },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:'5%'
  }
})