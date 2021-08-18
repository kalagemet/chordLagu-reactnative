import React, {useState} from 'react'
import { View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, ToastAndroid } from "react-native";
import Loader from '../components/Loader';
import Button from '../components/Button';
import { useTheme } from '@react-navigation/native';
import * as API from '../api/SongDbApi';
import { getAbjad, encode } from '../utils/encode';
import { decodeToPlainText } from '../utils/decode';
import * as STORAGE from '../Storage';

export default function EditSong({navigation, route}) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdBy, setCreatedBy] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  React.useEffect(()=>{
    checkIfDownloaded()
    API.getSongContent(route.params.path, onSongsReceived)
  },[navigation])

  const onSongsReceived = (song) => {
    let content = decodeToPlainText(song.isi)
    setArtist(song.nama_band)
    setTitle(song.judul)
    setContent(content)
    setCreatedBy(song.created_by)
  }

  const checkIfDownloaded = () => {
    STORAGE.getSavedSong(route.params.path, (item) => {
      if (item && item.id == route.params.path) {
        setIsSaved(true)
      } else {
        setIsSaved(false)
      }
    })
  }

  const uploadChord = () => {
    if(artist && title && content){
      setLoading(true)
      let song = {
        id : route.params.path,
        nama_band : artist,
        chord : encode(content),
        judul : title,
        abjad : getAbjad(artist)
      }
      let update = {
        id : route.params.path,
        nama_band : artist,
        isi : encode(content),
        judul : title,
        abjad : getAbjad(artist),
        created_by : createdBy
      }
      API.updateChord(song, () => {
        isSaved && STORAGE.updateSaved(update, () => {console.log('download updated')})
        ToastAndroid.showWithGravityAndOffset(
          "Berhasil Mengupdate Chord",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        )
        navigation.navigate('Home')
      }, ()=> setLoading(false))
    }else {
      ToastAndroid.showWithGravityAndOffset(
        "Tidak boleh ada yang kosong",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      )
    }
  }

  const onSongUpdated = () => {
    setLoading(false)
    ToastAndroid.show({
      text: "Berhasil diupdate",
      buttonText: "Okay",
      position: 'bottom'
    })
    navigation.navigate('Home');
  }

  return (
    <>
      <View style={{maxHeight:'87%'}}>
        <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="none"
        >
          <Loader loading={loading} />
          <KeyboardAvoidingView>
              <TextInput
              style={{...styles.input, color:colors.text}}
              placeholderTextColor={colors.text}
              placeholder="Nama Artis"
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={artist => setArtist(artist)}
              value={artist}
              />

              <TextInput
              style={{...styles.input, color:colors.text}}
              placeholderTextColor={colors.text}
              placeholder="Judul Lagu"
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={title => setTitle(title)}
              value={title}
              />

              <TextInput
              textAlignVertical="top"
              style={styles.content}
              placeholder={contentPlaceholder}
              multiline = {true}
              numberOfLines={4}
              placeholderTextColor="#aaa"
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={content => setContent(content)}
              value={content}
              scrollEnabled
              />          
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
      <View style={{height:'70%', paddingHorizontal:'5%'}}>
        <Button name='Simpan' onPress={uploadChord} height='8%' />
      </View>
    </>
  )
    
}

const contentPlaceholder =
"Tulis Lagu di sini\n" +
" C              Dm          G\n" +
"lagu ditulis dengan format seperti ini\n\n\n"

const styles = StyleSheet.create({
    container: {
      padding: 10
    },
    tabsContainer: {
      flexDirection: 'row'
    },
    tabActive: {
      borderTopRightRadius: 3,
      borderTopLeftRadius: 3,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#eee'
    },
    tabInactive: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#fff'
    },
    input: {
      fontSize: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      marginBottom: 5
    },
    content: {
      flex: 1,
      minHeight: 200,
      padding: 10,
      backgroundColor: '#eee',
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
      fontFamily:'monospace'
    },
    sideMenuContainer: {
      backgroundColor: '#eee',
      flex: 1
    },
    toolbarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ccc'
    }
  })