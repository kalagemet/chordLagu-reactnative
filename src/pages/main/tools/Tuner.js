import React, { useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  View,
  Text,
} from "react-native";
import KeepAwake from "react-native-keep-awake";
import Meter from "../../../components/tuner/meter";
import Note from "../../../components/tuner/note";
import TunerContainer from "../../../components/tuner/tunerContainer";
import { useTheme, useFocusEffect } from "@react-navigation/native";

const tuner = new TunerContainer();

export default function Tuner({ navigation }) {
  const { colors } = useTheme();
  const [position, setPosition] = useState(6);
  const [note, setNote] = useState({
    name: "E",
    octave: 2,
    frequency: 82.41,
  });

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const setStringPos = (note) => {
        let stringPos = 0;
        if (note.name[0] == "E" && note.octave == 2) {
          stringPos = 6;
        } else if (note.name[0] == "A" && note.octave == 2 && !note.name[1]) {
          stringPos = 5;
        } else if (note.name[0] == "D" && note.octave == 3 && !note.name[1]) {
          stringPos = 4;
        } else if (note.name[0] == "G" && note.octave == 3 && !note.name[1]) {
          stringPos = 3;
        } else if (note.name[0] == "B" && note.octave == 3) {
          stringPos = 2;
        } else if (note.name[0] == "E" && note.octave == 4 && !note.name[1]) {
          stringPos = 1;
        } else {
          stringPos = "-";
        }
        setPosition(stringPos);
      };

      const request_audio_permission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: "Izin Perekaman Audio",
              message: "ChordLagu memerlukan akses perekaman audio",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            let lastNoteName = "E";
            if (isActive) {
              tuner.start();
              tuner.onNoteDetected = (value) => {
                if (isActive) {
                  if (lastNoteName === value.name) {
                    setNote(value);
                    setStringPos(value);
                  } else {
                    lastNoteName = value.name;
                  }
                }
              };
            } else {
              tuner.stop();
            }
          } else {
            Alert.alert("Akses perekaman audio tidak diizinkan");
          }
        } catch (err) {
          console.log(err);
        }
      };

      request_audio_permission();

      return () => {
        tuner.stop();
        isActive = false;
      };
    }, [navigation])
  );

  return (
    <View style={style.body}>
      <Meter cents={note.cents} />
      <Note {...note} />
      <Text style={{ fontSize: 28, color: colors.text }}>
        {note.frequency.toFixed(1)} Hz
      </Text>
      <Text style={{ fontSize: 18, color: colors.text }}>
        Senar ke - {position}
      </Text>
      <KeepAwake />
    </View>
  );
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
