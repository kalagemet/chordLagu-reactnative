import { Text } from 'native-base';
import React from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View, AppState } from "react-native";
import KeepAwake from 'react-native-keep-awake';
import Meter from "../../../components/tuner/meter";
import Note from "../../../components/tuner/note";
import TunerContainer from "../../../components/tuner/tunerContainer";
//import { NavigationEvents } from 'react-navigation';

const tuner = new TunerContainer();

export default class Tuner extends React.Component {
    state = {
        note: {
            name: "E",
            octave: 2,
            frequency: 82
        },
        position : 6,
        record : true,
        appState: ''
    };

    _update(note) {
        this.setState({ note });
        this.getStringPos();
    }

    getStringPos = () => {
        let stringPos = 0;
        if(this.state.note.name[0] == 'E' && this.state.note.octave == 2){
          stringPos = 6
        }else if(this.state.note.name[0] == 'A' && this.state.note.octave == 2 && !this.state.note.name[1]){
          stringPos = 5
        }else if(this.state.note.name[0] == 'D' && this.state.note.octave == 3 && !this.state.note.name[1]){
          stringPos = 4
        }else if(this.state.note.name[0] == 'G' && this.state.note.octave == 3 && !this.state.note.name[1]){
          stringPos = 3
        }else if(this.state.note.name[0] == 'B' && this.state.note.octave == 3){
          stringPos = 2
        }else if(this.state.note.name[0] == 'E' && this.state.note.octave == 4 && !this.state.note.name[1]){
          stringPos = 1
        }else{
          stringPos = '-'
        }
        this.setState({position : stringPos})
      }

    request_audio_permission = async() => {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO ,
            {
                'title': 'Izin Perekaman Audio',
                'message': 'ChordLagu memerlukan akses perekaman audio'
            }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            tuner.start();
            tuner.onNoteDetected = note => {
                if (this._lastNoteName === note.name) {
                this._update(note);
                } else {
                this._lastNoteName = note.name;
                }
            };
            }
            else {
            Alert.alert("Akses perekaman audio tidak diizinkan");
            }
        } catch (err) {
            console.log(err)
        }
    }

    startTuner = async () => {

    }

    componentDidMount() {
      this.request_audio_permission()
      this.focus = this.props.navigation.addListener('focus', () => {
        this.request_audio_permission()
      });
      this.blur = this.props.navigation.addListener('blur', () => {
        tuner.stop()
      });
    }
  
    componentWillUnmount() {
      this.focus();
      this.blur();
    }

    _handleAppStateChange = async (nextAppState) => {
      if (nextAppState == 'active') {
        if(this.props.nav.isFocused())
        await this.request_audio_permission();
      } else {
        tuner.stop();
      }
    };
  

    render() {
        return (
            <View style={style.body}>
              {/* <NavigationEvents
                onDidFocus={async() => await this.request_audio_permission() }
                onWillBlur={() => {tuner.stop()}}
                onDidBlur={() => tuner.stop()}
              /> */}
              <Meter cents={this.state.note.cents} />
              <Note {...this.state.note} />
              <Text style={style.frequency}>
                  {this.state.note.frequency.toFixed(1)} Hz
              </Text>
              <Text style={style.strings}>
                Senar ke - {this.state.position}
              </Text>
              <KeepAwake/>
            </View>
        );
    }
}

const style = StyleSheet.create({
    body: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    frequency: {
      fontSize: 28,
      color: "#37474f"
    },
    strings: {
      fontSize: 18,
      color: "#c62828"
    }
  });