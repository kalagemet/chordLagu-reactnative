import React from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Button, ToastAndroid } from "react-native";
import { getSong, updateSong } from '../api/SongsApi';
import Loader from '../components/Loader';

export default class EditSong extends React.Component {
  state = {
    title :'',
    artist :'',
    content :'',
    created_by :'',
    favourites : 0,
    loading : false
  }

  componentDidMount() {
      console.log(this.props.navigation.state.params.path);
    getSong(this.props.navigation.state.params.path, this.onSongsReceived)
  }

  onSongsReceived = (song) => {
    var content = song.content.replace(/:x1:/g, '\n');
    this.setState( prevState => ({
        artist: prevState.artist = song.artist,
        title : prevState.title = song.title,
        created_by: prevState.created_by = song.created_by,
        favourites : prevState.favourites = song.favourites,
      })); 
    //console.log(content);
    this.setState({ content });
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
      artist : this.state.artist,
      content : this.state.content,
      title : this.state.title,
      created_by : this.state.created_by,
      favourites : this.state.favourites
    }
    //console.log("title : "+this.state.title+" , artist : "+this.state.artist+" , content : "+moddedContent+", user : "+this.props.user.email)
    updateSong(this.props.navigation.state.params.path, song, (e) => this.onSongUpdated(e))
  }

  onSongUpdated = (song) => {
    this.setState({
      loading: false
    });
    ToastAndroid.show({
      text: "Berhasil diupdate",
      buttonText: "Okay",
      position: 'bottom'
    })
    this.props.navigation.navigate('Home');
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
                value={this.state.artist}
                />

                <TextInput
                style={styles.input}
                placeholder="Judul Lagu"
                autoFocus={false}
                autoCorrect={false}
                autoCapitalize='words'
                onChangeText={title => this.setState({title})}
                value={this.state.title}
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
                onChangeText={content => this.setState({content})}
                value={this.state.content}
                scrollEnabled
                />
                <View style={{flexDirection:'column', alignItems:'flex-end'}}>
                  <Button primary onPress={this.uploadChord} style={{padding:20, margin:20}} title="Simpan"></Button>
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