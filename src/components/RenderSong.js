import React, {useState, useRef} from 'react';
import {View} from 'react-native';
import { WebView } from 'react-native-webview';
import KeepAwake from 'react-native-keep-awake';
import ChordSheetJS from 'chordsheetjs';
import TransformSong from './TransformSong';
import Loader from './Loader';
import chords from '../assets/chords/guitar.json';
import ChordModal from './ChordModal';
import { getSong } from '../api/SongsApi';
import { getSongContent } from '../api/SongDbApi';

export default function RenderSong({songPath, typeAPI, jsRun, transpose}) {
    const [loading, setLoading] = useState(false)
    const [chord, setChord] = useState('')
    const [selectedChord, setSelectedChord] = useState('')
    const [showChord, setShowChord] = useState(false)
    const [chordName, setChordName] = useState('')
    const webViewRef = useRef();

    React.useEffect(()=>{
      setLoading(true)
      if(typeAPI == 'localAPI'){
        getSong(songPath, onSongsReceived)
      }else {
        getSongContent(songPath, (data)=>{
          setChord(getChordPro(data.isi, data.nama_band, data.judul))
          setLoading(false)
        })
      }
    },[])

    React.useEffect(()=>{
      setTimeout(() => {
        webViewRef.current.injectJavaScript(jsRun);
      }, 100);
    })
    
    const normalize = (chord) => {
      chord.map((data) => {
        data.items.map((data2, index) => {
          data2.lyrics = data2.lyrics.replace(/\[|]/g, '*')
          data2.chords = data2.chords.trim()
          if ( data2.chords == ''){
            if ( data2.lyrics.search('{title:') != -1 || data2.lyrics.search('{artist:') != -1){
              data2.lyrics = data2.lyrics;
            }else{
              var temp = '';
              data2.lyrics.split(" ").map(function(item, idx) {
                if(idx != 0){
                  temp += ' ';
                }
                if (chords[item]){
                  temp += '['+item+'] ';
                }else{
                  temp += item;
                }
              });
              data2.lyrics=temp;
              if(data2.lyrics.charAt(data2.lyrics.length-1) == ' '){
                data2.lyrics='{comment:'+data2.lyrics+'} '
              }else{
                data2.lyrics='{comment:'+data2.lyrics+'}'
              }
              
            }
          }
        })
      })     
      
    }

    const getChord = (chordSheet, artist, title) => {  
      let propSong = ''
      propSong += '{title:'+title+'}\n';
      propSong += '{artist:'+artist+'}\n';
      
      propSong += chordSheet;
      

        const parser = new ChordSheetJS.ChordSheetParser();;
        const song = parser.parse(propSong);
        normalize(song.lines)
        
        // const finalSong = parser.parse(normalizedSong)
        
        const formatter = new ChordSheetJS.ChordProFormatter();
        const disp = formatter.format(song);
        
        return disp;
    }

    const getChordPro = (chordSheet, title, artist) => {
      let song = ''
      song += '{title:'+title+'}\n';
      song += '{artist:'+artist+'}\n';
      
      song += chordSheet;

      song = song.replace(/&rsquo;/g, '\'')
      song = song.replace(/:s10:/g, '          ')
      song = song.replace(/:s9:/g, '         ')
      song = song.replace(/:s8:/g, '        ')
      song = song.replace(/:s7:/g, '       ')
      song = song.replace(/:s6:/g, '      ')
      song = song.replace(/:s5:/g, '     ')
      song = song.replace(/:s4:/g, '    ')
      song = song.replace(/:s3:/g, '   ')
      song = song.replace(/:s2:/g, '  ')
      song = song.replace(/:s1:/g, ' ')
      song = song.replace(/:x5:/g, '\n\n\n\n\n')
      song = song.replace(/:x4:/g, '\n\n\n\n')
      song = song.replace(/:x3:/g, '\n\n\n')
      song = song.replace(/:x2:/g, '\n\n')
      song = song.replace(/:x1:/g, '\n')
      


      const parser = new ChordSheetJS.ChordSheetParser();;
      const parsedSong = parser.parse(song);
      normalize(parsedSong.lines)
      
      // const finalSong = parser.parse(normalizedSong)
      
      const formatter = new ChordSheetJS.ChordProFormatter();
      const disp = formatter.format(parsedSong);
      
      return disp;
    }

    const renderHtml = (body, styles) => {
        return `<html>
          <head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>
          <body>${body}</body>
          <style>${styles}</style>
        </html>`
    }

    const onSongsReceived = (song) => {
      let content = song.content.replace(/:x1:/g, '\n');
      let artist = song.artist.toLowerCase()
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ')
      let title = song.title.toLowerCase()
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ')

      setChord(getChord(content, artist, title))
      setLoading(false)
    }

    const handleMessage = (selectedChord) => {
      if (chords[selectedChord.toString()]){
        let chord = chords[selectedChord.toString()][0].positions
        //let kords = chords[selectedChord.toString()]
        setChordName(selectedChord.toString())
        setSelectedChord(chord)
        setShowChord(true)
      }
      
    }

    const closeChord = () => {
      setShowChord(false)
    }

    return(
      <View>
        <TransformSong
          chordProSong={chord}
          transposeDelta={transpose}
          showTabs={false}
          typeAPI = {typeAPI}
          //fontSize={fontSize}
        >
          {songProps => (
            <View >
              <Loader loading={loading} />
              <ChordModal
                show={showChord}
                name={chordName}
                selectedChord={selectedChord}
                closeModal = {closeChord}
              />
              <View style={{ height : '100%' }}>
                <WebView 
                  ref={webViewRef}
                  source={{ html: renderHtml(songProps.htmlSong, styles) }}
                  injectedJavaScript={onClickChordPostMessage}
                  onMessage = {(event)=> handleMessage(event.nativeEvent.data)}
                  javaScriptEnabled = {true}
                  automaticallyAdjustContentInsets={false}
                  style={{margin:0, padding:0}}
                />
              </View>
              
              
            </View>
          )}
          
        </TransformSong>
        <KeepAwake/>
      </View>
        
    )
    
}

const onClickChordPostMessage = `
(
  function() {
    function onClickChord (chord) {
      return function () {
        window.ReactNativeWebView.postMessage(chord)
      }
    }
    var anchors = document.getElementsByClassName('chord');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        var chord = anchor.innerText || anchor.textContent;
        anchor.onclick = onClickChord(chord)
    }
})();

true;
`

const styles = `
body {
  font-family: monospace;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
   -khtml-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.title {
  font-size: 20px
}
.artist {
  font-weight: bold;
  cursor: pointer;
}
.chord:hover {
  color: blue;
}
.line {
  margin: 0;
  padding: 0;
  position: relative;
  margin-bottom: 0px;
  font-size: 14px;
  font-family: monospace;
  white-space: pre-wrap;
  margin-right: 10px;
}
.line-size-14 { font-size: 14px; }
.line-size-15 { font-size: 15px; }
.line-size-16 { font-size: 16px; }
.line-size-17 { font-size: 17px; }
.line-size-18 { font-size: 18px; }
.line-size-19 { font-size: 19px; }
.line-size-20 { font-size: 20px; }
.line-size-21 { font-size: 21px; }
.line-size-22 { font-size: 22px; }
.line-size-23 { font-size: 23px; }
.line-size-24 { font-size: 24px; }
.chord {
  color: blue;
  position: relative;
  display: inline-block;
  padding-top: 20px;
  width: 0px;
  top: -17px;

}

.chord-inline {
  position: inherit;
  display: inline-block;
  padding-top: 0px;
  width: auto;
  top: auto;
}
.chord-size-14 { top: -14px; }
.chord-size-15 { top: -15px; }
.chord-size-16 { top: -16px; }
.chord-size-17 { top: -17px; }
.chord-size-18 { top: -18px; }
.chord-size-19 { top: -19px; }
.chord-size-20 { top: -20px; }
.chord-size-21 { top: -21px; }
.chord-size-22 { top: -22px; }
.chord-size-23 { top: -23px; }
.chord-size-24 { top: -24px; }
.chord:active {
  color: blue;
}
.word {
  display: inline-block;
}
.tab {
}
.tab-line {
  max-width: 4px;
  display: inline-block;
  word-wrap: break-word;
  padding-bottom: 20px;
}
`