import React, {useState} from 'react'
import { View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, ToastAndroid } from "react-native";
import Loader from '../components/Loader';
import * as STORAGE from '../Storage';
import Button from '../components/Button';
import { useTheme } from '@react-navigation/native';
import * as API from '../api/SongDbApi';
import { encode, getAbjad } from '../utils/encode';

export default function MakeSong({navigation}) {
  const { colors } = useTheme();
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
        artist : artist,
        content : encode(content),
        created_by : email,
        abjad : getAbjad(artist),
        title : title
      }
      API.postSong(song, onSongAdded, ()=>setLoading(false))
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

  const onSongAdded = (msg) => {
    console.log(msg)
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
              style={{...styles.input, color:colors.text, borderBottomColor:colors.text}}
              placeholderTextColor={colors.text}
              placeholder="Nama Artis"
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={artist => setArtist(artist)}
              // value={artist}
              />

              <TextInput
              style={{...styles.input, color:colors.text, borderBottomColor:colors.text}}
              placeholderTextColor={colors.text}
              placeholder="Judul Lagu"
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize='words'
              onChangeText={title => setTitle(title)}
              // value={title}
              />

              <TextInput
              textAlignVertical="top"
              style={{...styles.content, color:colors.text, backgroundColor:colors.background}}
              placeholder={contentPlaceholder}
              placeholderTextColor={colors.text}
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
      <View style={{height:'70%', paddingHorizontal:'5%'}}>
      <Button name='Unggah' onPress={uploadChord} height='8%'/>
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
      padding: 20
    },
    input: {
      fontSize: 16,
      borderBottomWidth: 1,
      marginBottom: 5
    },
    content: {
      flex: 1,
      minHeight: 200,
      padding: 10,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
      fontFamily:'monospace'
    }
  })