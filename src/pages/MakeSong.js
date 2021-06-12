import React from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import {Button, Toast} from 'native-base';
import { addSong } from '../api/SongsApi';
import Loader from '../components/Loader';

export default class MakeSong extends React.Component {
  state = {
    title :'',
    artist :'',
    content :'',
    loading : false
  }

  uploadChord = () => {
    // var splitted = '';

    // this.state.content.split("\n").map(function(item, idx) {
    //   splitted += item + ':x1:';
    // });
    // console.log(splitted)

    this.setState({
      loading: true
    });
    var song = {
      artist : this.state.artist.toLowerCase(),
      content : this.state.content,
      created_by : this.props.user.email,
      favourites : 0,
      title : this.state.title.toLowerCase()
    }
    //console.log("title : "+this.state.title+" , artist : "+this.state.artist+" , content : "+moddedContent+", user : "+this.props.user.email)
    addSong(song, (e) => this.onSongAdded(e))
  }

  onSongAdded = (song) => {
    this.setState({
      loading: false
    });
    Toast.show({
      text: "Berhasil diunggah",
      buttonText: "Okay",
      position: 'bottom'
    })

    this.props.navigation.pop();
  }
    render() {
        return (
            <ScrollView
            contentContainerStyle={styles.container}
            keyboardDismissMode="none"
            >
            <Loader loading={this.state.loading} />
            <KeyboardAvoidingView>
                <TextInput
                style={styles.input}
                placeholder="Nama Artis"
                autoFocus={false}
                autoCorrect={false}
                autoCapitalize='words'
                onChangeText={artist => this.setState({artist})}
                // value={artist}
                />

                <TextInput
                style={styles.input}
                placeholder="Judul Lagu"
                autoFocus={false}
                autoCorrect={false}
                autoCapitalize='words'
                onChangeText={title => this.setState({title})}
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
                onChangeText={content => this.setState({content})}
                scrollEnabled
                // value={content}
                />
                <View style={{flexDirection:'column', alignItems:'flex-end'}}>
                  <Button primary style={{padding:20, margin:20}}><Text style={{color:'white'}} onPress={this.uploadChord}> Unggah </Text></Button>
                </View>
                
            </KeyboardAvoidingView>
            </ScrollView>
        )
    }
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