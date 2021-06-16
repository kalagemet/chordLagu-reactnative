import React, {useState} from 'react'
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid } from "react-native";
import { getSong, updateSong } from '../api/SongsApi';
import Loader from '../components/Loader';
import Button from '../components/Button';

export default function EditSong({navigation, route}) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [content, setContent] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [favourites, setFavourites] = useState(0)
  const [loading, setLoading] = useState(false)

  React.useEffect(()=>{
    getSong(route.params.path, onSongsReceived)
  },[navigation])

  const onSongsReceived = (song) => {
    let content = song.content.replace(/:x1:/g, '\n');
    setArtist(song.artist)
    setTitle(song.title)
    setCreatedBy(song.created_by)
    setFavourites(song.favourites)
    setContent(content)
  }

  const uploadChord = () => {
    if(artist && title && content){
      setLoading(true)
      let song = {
        artist : artist,
        content : content,
        title : title,
        created_by : createdBy,
        favourites : favourites
      }
      updateSong(route.params.path, song, () => navigation.navigate('Home'))
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
              style={styles.input}
              placeholder="Nama Artis"
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={artist => setArtist(artist)}
              value={artist}
              />

              <TextInput
              style={styles.input}
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
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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