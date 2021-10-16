import { View } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import chords from '../../../assets/chords/guitar.json';
import ChordSwiper from '../../../components/ChordSwiper';
import Loader from '../../../components/Loader';
import { useTheme } from '@react-navigation/native';

export default function ChordLibrary({navigation}) {
    const { colors } = useTheme();
    const [chordBase, setChordBase] = useState('A')
    const [chordQuality, setChordQuality] = useState('')
    const [chordBass, setChordBass] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedChord, setSelectedChord] = useState(chords["A"])

    const handleChordBase = (base) => {
        setChordBase(base)
        var selectedChord = base+chordQuality+chordBass;
        let kords = chords[selectedChord.toString()]
        setSelectedChord(kords)
    }

    const handleChordQuality = (quality) => {
        setChordQuality(quality)
        var selectedChord = chordBase+quality+chordBass;
        let kords = chords[selectedChord.toString()]
        setSelectedChord(kords)
    }

    const handleChordBass = (bass) => {
        setChordBass(bass)
        var selectedChord = chordBase+chordQuality+bass;
        let kords = chords[selectedChord.toString()]
        setSelectedChord(kords)
    }

    return (
        <View style={{flex:1}}>
            <Loader
            loading={loading} />
            <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
                <Picker
                    mode='dropdown'
                    style={{width:'33%', color:colors.text}}
                    dropdownIconColor={colors.text}
                    selectedValue={chordBase}
                    onValueChange={chordBase => handleChordBase(chordBase)}
                >
                    <Picker.Item label="A" value="A" />
                    <Picker.Item label="A#" value="A#" />
                    <Picker.Item label="B" value="B" />
                    <Picker.Item label="C" value="C" />
                    <Picker.Item label="C#" value="C#" />
                    <Picker.Item label="D" value="D" />
                    <Picker.Item label="D#" value="D#" />
                    <Picker.Item label="E" value="E" />
                    <Picker.Item label="F" value="F" />
                    <Picker.Item label="F#" value="F#" />
                    <Picker.Item label="G" value="G" />
                    <Picker.Item label="G#" value="G#" />
                </Picker>
                <Picker
                    mode='dropdown'
                    style={{width:'33%', color:colors.text}}
                    dropdownIconColor={colors.text}
                    selectedValue={chordQuality}
                    onValueChange={chordQuality => handleChordQuality(chordQuality)}
                >
                    <Picker.Item label="major" value="" />
                    <Picker.Item label="minor" value="m" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="m7" value="m7" />
                    <Picker.Item label="maj7" value="maj7" />
                    <Picker.Item label="dim7" value="dim7" />
                    <Picker.Item label="m/maj7" value="m/maj7" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="dim" value="dim" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="m6" value="m6" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="m9" value="m9" />
                    <Picker.Item label="maj9" value="maj9" />
                    <Picker.Item label="sus2" value="sus2" />
                    <Picker.Item label="sus4" value="sus4" />
                    <Picker.Item label="add9" value="add9" />
                    <Picker.Item label="5" value="5" />
                </Picker>
                <Picker
                    mode='dropdown'
                    style={{width:'33%', color:colors.text}}
                    dropdownIconColor={colors.text}
                    selectedValue={chordBass}
                    onValueChange={chordBass => handleChordBass(chordBass)}
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="/A" value="/A" />
                    <Picker.Item label="/A#" value="/A#" />
                    <Picker.Item label="/B" value="/B" />
                    <Picker.Item label="/C" value="/C" />
                    <Picker.Item label="/C#" value="/C#" />
                    <Picker.Item label="/D" value="/D" />
                    <Picker.Item label="/D#" value="/D#" />
                    <Picker.Item label="/E" value="/E" />
                    <Picker.Item label="/F" value="/F" />
                    <Picker.Item label="/F#" value="/F#" />
                    <Picker.Item label="/G" value="/G" />
                    <Picker.Item label="/G#" value="/G#" />
                </Picker>
            </View>
            <ChordSwiper selectedChord={selectedChord} name={chordBase+chordQuality+chordBass}/>
        </View>
    );
    
}