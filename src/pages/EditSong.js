import React, {useState} from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Button, ToastAndroid } from "react-native";
import { getSong, updateSong } from '../api/SongsApi';
import Loader from '../components/Loader';

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
    setLoading(true)
    let song = {
      artist : artist,
      content : content,
      title : title,
      created_by : createdBy,
      favourites : favourites
    }
    updateSong(route.params.path, song, (e) => onSongUpdated(e))
  }

  const onSongUpdated = (song) => {
    setLoading(false)
    ToastAndroid.show({
      text: "Berhasil diupdate",
      buttonText: "Okay",
      position: 'bottom'
    })
    navigation.navigate('Home');
  }

  return (
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
          <View style={{flexDirection:'column', alignItems:'flex-end'}}>
            <Button primary onPress={uploadChord} style={{padding:20, margin:20}} title="Simpan"></Button>
          </View>
          
      </KeyboardAvoidingView>
      </ScrollView>
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