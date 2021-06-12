import React, {useState} from 'react'
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid } from "react-native";
import { addSong } from '../api/SongsApi';
import Loader from '../components/Loader';
import * as STORAGE from '../Storage';
import Button from '../components/Button';

export default function MakeSong({navigation}) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  React.useEffect(()=>{
    STORAGE.getUserInfo((value)=>{
      setEmail(value.email)
    })
  },[navigation])

  const uploadChord = () => {
    if(artist && title && content){
      setLoading(true)
      let song = {
        artist : artist.toLowerCase(),
        content : content,
        created_by : email,
        favourites : 0,
        title : title.toLowerCase()
      }
      addSong(song, (e) => onSongAdded(e))
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

  const onSongAdded = (song) => {
    setLoading(false)
    ToastAndroid.showWithGravityAndOffset(
      "Berhasil Disimpan",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    )
    navigation.pop();
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
              // value={artist}
              />

              <TextInput
              style={styles.input}
              placeholder="Judul Lagu"
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={title => setTitle(title)}
              // value={title}
              />

              <TextInput
              textAlignVertical="top"
              style={styles.content}
              placeholder={contentPlaceholder}
              placeholderTextColor="#aaa"
              multiline = {true}
              numberOfLines={4}
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={content => setContent(content)}
              scrollEnabled
              // value={content}
              />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
      <View style={{height:'70%'}}>
      <Button name='Unggah' onPress={uploadChord} />
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