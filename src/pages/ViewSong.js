import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Alert, ToastAndroid, Text, View, BackHandler } from 'react-native';
import RenderSong from '../components/RenderSong';
import Slider from '@react-native-community/slider';
import { deleteSong, addToFavourite, removeFavourite, isFavourited } from '../api/SongsApi';
import { getStreamsBySearch } from '../api/StreamsApi';
import StreamList from '../components/StreamList';
import BottomSheet from '@gorhom/bottom-sheet';
import StreamModal from '../components/StreamModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { getSongContent } from '../api/SongDbApi';
import * as STORAGE from '../Storage';
import { useTheme } from '@react-navigation/native';

export default function ViewSong({ navigation, route }) {
  const { colors } = useTheme();
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
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['5%', '35%'], []);
  
  React.useEffect(() => {
    console.log("created BY : " + created_by)
    if (typeAPI == 'localAPI' && user != '') {
      isFavourited(songPath, user, (fav) => {
        console.log("fav : " + fav)
        setFavourited(fav)
      })
    } else if (typeAPI == 'downloaded') {
      setFavourited(true)
    }
    getStreamsBySearch(title, (streamsList) => {
      setStreamsList(streamsList)
    })
  }, [navigation])

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
    if (transpose < 0) {
      setTranspose(transpose + 1)
    }
  }

  const transposeDown = () => {
    if (transpose > -24) {
      setTranspose(transpose - 1)
    }
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


  const onClickFavourite = () => {
    setLoading(true)

    if (favourited) {
      removeFavourite(user, songPath, onRemovedFavourite)
    } else {
      let favourite = {
        user: user,
        songId: songPath
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

  const onFavouriteComplete = () => {
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
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil Dihapus",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      )
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
        ToastAndroid.showWithGravityAndOffset(
          "Berhasil Dihapus dari Favorit",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        )
      })
    } else {
      getSongContent(songPath, (data) => {
        STORAGE.saveSong(data, () => {
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
              <Ionicons color={colors.text} size={25} name="pause" onPress={stop} /> :
              <Ionicons color={colors.text} size={25} name="play" onPress={start} />
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
          <Text style={{color:colors.text}}>{sliderValue.toFixed(2)} x</Text>
        </View>
        <View style={styles.tool}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Ionicons size={30} style={{ color: colors.card, backgroundColor: colors.primary, borderRadius: 3 }} onPress={transposeDown} name="remove" />
            <Text style={{ fontSize: 11, alignSelf: 'center', marginHorizontal: '3%', color:colors.text }}>Nada: {(transpose + 12) >= 0 ? `+${transpose + 12}` : transpose + 12}</Text>
            <Ionicons size={30} style={{ color: colors.card, backgroundColor: colors.primary, borderRadius: 3 }} onPress={transposeUp} name="add" />
          </View>
          {
            user == created_by ?
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                <Ionicons name="heart" style={{ fontSize: 30, marginHorizontal: 10, color: favourited ? '#F05454' : '#ccc' }} onPress={onClickFavourite} />
                <Ionicons name="create" style={{ fontSize: 30, marginHorizontal: 10, color: colors.primary }} onPress={() => navigation.navigate('EditSong', { path: songPath })} />
                <Ionicons name="trash" style={{ fontSize: 30, marginHorizontal: 10, color: colors.primary, justifyContent: 'flex-end' }} onPress={onDeleteSong} />
              </View>
              :
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                {(typeAPI == 'localAPI' && user != '') && <Ionicons name="heart" style={{ fontSize: 30, color: favourited ? '#F05454' : '#ccc' }} onPress={onClickFavourite} />}
                {(typeAPI == 'desalase' || typeAPI == 'downloaded') && <Ionicons name="heart" style={{ fontSize: 30, color: favourited ? '#F05454' : '#ccc' }} onPress={onClickDownload} />}
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
    <View style={{ flex: 1}}>
      <View style={{ height: '91%' }}>
        <RenderSong
          navigation={navigation}
          openSideMenu={openSideMenu}
          songPath={songPath}
          typeAPI={typeAPI}
          transpose={transpose}
          jsRun={jsRun}
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

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex:1,
    justifyContent:'space-between'
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:'5%',
    marginVertical:'2%'
  },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:'5%'
  }
})