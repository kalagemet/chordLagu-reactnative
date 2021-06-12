import { Container, Content, Form, Picker, Text } from 'native-base';
import React from 'react';
import chords from '../../../assets/chords/guitar.json';
import ChordSwiper from '../../../components/ChordSwiper';
import Loader from '../../../components/Loader';

export default class ChordLibrary extends React.Component {

    state = { chordBase : 'A', chordQuality:'', chordBass:'', loading: false, selectedChord:chords["A"]}

    componentDidMount(){
        
    }

    handleChordBase = (base) => {
        this.setState({ chordBase: base})
        var selectedChord = base+this.state.chordQuality+this.state.chordBass;
        let kords = chords[selectedChord.toString()]
        this.setState({ selectedChord: kords })
    }

    handleChordQuality = (quality) => {
        this.setState({ chordQuality: quality})
        var selectedChord = this.state.chordBase+quality+this.state.chordBass;
        let kords = chords[selectedChord.toString()]
        this.setState({ selectedChord: kords })
        console.log(selectedChord)
    }

    handleChordBass = (bass) => {
        this.setState({ chordBass: bass})
        var selectedChord = this.state.chordBase+this.state.chordQuality+bass;
        let kords = chords[selectedChord.toString()]
        this.setState({ selectedChord: kords })
        console.log(selectedChord)
    }

    render() {
        return (
        <Container>
            <Loader
            loading={this.state.loading} />
            <Content contentContainerStyle={{ flex: 1 }}>
            <Form style={{flexDirection:'row', justifyContent:'center', padding:'1%', alignItems:'center'}}>
                <Text>Chord : </Text>
                <Picker
                        note
                        mode="dropdown"
                        style={{ width: 80 }}
                        selectedValue={this.state.chordBase}
                        onValueChange={chordBase => this.handleChordBase(chordBase)}
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
                        note
                        mode="dropdown"
                        style={{ width: 80 }}
                        selectedValue={this.state.chordQuality}
                        onValueChange={chordQuality => this.handleChordQuality(chordQuality)}
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
                        note
                        mode="dropdown"
                        style={{ width: 80 }}
                        selectedValue={this.state.chordBass}
                        onValueChange={chordBass => this.handleChordBass(chordBass)}
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
            </Form>
            <ChordSwiper selectedChord={this.state.selectedChord} name={this.state.chordBase+this.state.chordQuality+this.state.chordBass}/>
            </Content>
        </Container>
        );
    }
}