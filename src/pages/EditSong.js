import React, {useState} from 'react'
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid } from "react-native";
import { getSong, updateSong } from '../api/SongsApi';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { useTheme } from '@react-navigation/native';
import * as API from '../api/SongDbApi';
import { getAbjad } from '../utils/encode';
import { decodeToPlainText } from '../utils/decode';

export default function EditSong({navigation, route}) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  React.useEffect(()=>{
    API.getSongContent(route.params.path, onSongsReceived)
  },[navigation])

  const onSongsReceived = (song) => {
    let content = decodeToPlainText(song.isi)
    setArtist(song.nama_band)
    setTitle(song.judul)
    setContent(content)
  }

  const uploadChord = () => {
    if(artist && title && content){
      setLoading(true)
      let song = {
        id : route.params.path,
        nama_band : artist,
        chord : content,
        judul : title,
        abjad : getAbjad(artist)
      }
      API.updateChord(song, () => {
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
      <View style={{height:'70%'}}>
        <Button name='Simpan' onPress={uploadChord} />
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