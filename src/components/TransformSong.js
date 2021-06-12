import Chord from 'chordjs';
import ChordSheetJS from 'chordsheetjs';
import CustomHtmlDivFormatter from "./CustomHtmlDivFormatter";

const processChord = (item, processor) => {
    if (item instanceof ChordSheetJS.ChordLyricsPair) {
      if (item.chords) {
        let parsedChord = Chord.parse(item.chords);
        if (parsedChord) {
          const processedChordLyricsPair = item.clone();
          processedChordLyricsPair.chords = processor(parsedChord).toString();
          return processedChordLyricsPair;
        }
      }
    } else {
      if (item.name == 'comment' && item.value) {
        let commentSong = new ChordSheetJS.ChordProParser().parse(item.value)
        commentSong = transform(commentSong, processor);
        item.value = new ChordSheetJS.ChordProFormatter().format(commentSong)
      }
    }
    return item;
};

const transform = (song, processor) => {
    song.lines = song.lines.map((line) => {
        line.items = line.items.map(item => processChord(item, processor));
        return line;
    });
    return song;
};

export const transposeSong = (song, transposeDelta) => transform(song, chord => chord.transpose(transposeDelta))

export const getChords = (song) => {
    let allChords= []
    song.lines.forEach(line => {
      line.items.forEach(item => {
        if (item instanceof ChordSheetJS.ChordLyricsPair) {
          if (item.chords) {
            let parsedChord = Chord.parse(item.chords);
            if (parsedChord != null && allChords.find(c => c.toString() == parsedChord.toString()) == null) {
              allChords.push(parsedChord)
            }
          }
        } else {
          if (item.name == 'comment' && item.value) {
            let commentSong = new ChordSheetJS.ChordProParser().parse(item.value)
            getChords(commentSong).forEach(c => {
              if (!allChords.some(ac => ac.toString() == c.toString())) {
                allChords.push(c)
              }
            })
          }
        }
      })
    })
    return allChords
}

const TransformSong = (props) => {
    let { showTabs = false, transposeDelta = 0, chordProSong, fontSize = 14 } = props
    let htmlSong = ''
    let song
    if (chordProSong != null) {
        if (!showTabs) {
        chordProSong = chordProSong.replace(/{sot}(.|\n|\r)*?{eot}\r?\n?/g, '')
        }
        song = new ChordSheetJS.ChordProParser().parse(chordProSong);
    } else {
        song = new ChordSheetJS.ChordProParser().parse(chordProSong);
    }
    let transposedSong = song
    if (transposeDelta != 0) {
        transposedSong = transposeSong(song, transposeDelta);
    }
    let allChords = getChords(transposedSong)
    htmlSong = new CustomHtmlDivFormatter().format(transposedSong, fontSize)
    //console.log(htmlSong)
    return props.children({ chords: allChords, htmlSong })
}

export default TransformSong