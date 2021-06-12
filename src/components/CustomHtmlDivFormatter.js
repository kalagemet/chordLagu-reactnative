import ChordSheetJS from "chordsheetjs"
const NEW_LINE = '\n'

export default class CustomHtmlDivFormatter {
  isStartOfTabs(line) {
    return line.items.some(i => i instanceof ChordSheetJS.Tag && i.name == 'sot')
  }
  isEndOfTabs(line) {
    return line.items.some(i => i instanceof ChordSheetJS.Tag && i.name == 'eot')
  }
  getLyrics(line) {
    let lyrics = ""
    line.items.forEach(item => {
      if (item instanceof ChordSheetJS.ChordLyricsPair) {
        lyrics = lyrics + item.lyrics
      }
    })
    return lyrics
  }
  getTabStringArray(song, startAtIndex) {
    let tabArray = []
    let line = song.lines[startAtIndex]
    do {
      let tabLine = this.getLyrics(line)
      if (tabLine != '') {
        tabArray.push(tabLine)
      }
      startAtIndex++
      line = song.lines[startAtIndex]
    } while (line != null && !this.isEndOfTabs(line))
    return tabArray
  }
  transposeArray(array) {
    let biggestLine = 0
    array.forEach(line => biggestLine = Math.max(line.length, biggestLine))

    let transposedArray = [];
    for (let i = 0; i < biggestLine; i++) {
      transposedArray.push('')
    }

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < biggestLine; j++) {
        let character = array[i][j] ? array[i][j] : ' '
        transposedArray[j] = transposedArray[j] + character
      }
    }
    return transposedArray
  }

  format(song, fontSize = 14) {
    let CHORD_SIZE_CLASS = fontSize != 14 ? ` chord-size-${fontSize}` : ''
    let LYRICS_SIZE_CLASS = fontSize != 14 ? ` line-size-${fontSize}` : ''
    let html = ''
    let waitEndOfTabs = false
    song.lines.forEach((l, index) => {
      if (waitEndOfTabs) {
        if (this.isEndOfTabs(l)) {
          waitEndOfTabs = false
        }
        // Skip line
        return
      }
      if (this.isStartOfTabs(l)) {
        waitEndOfTabs = true
        let tabStringArray = this.getTabStringArray(song, index)
        let transposedArray = this.transposeArray(tabStringArray)
        html += `<div class="tab${LYRICS_SIZE_CLASS}">`
        transposedArray.forEach(tabLine => {
          html += `<div class="tab-line">${tabLine}</div>` + NEW_LINE
        })
        html += `</div>` + NEW_LINE
        // Skip line
        return
      }
      html += `<p class="line${LYRICS_SIZE_CLASS}">`
      if (l.currentChordLyricsPair == null ){
        html += `<br/>`
      }
      l.items.forEach(item => {
        if (item instanceof ChordSheetJS.ChordLyricsPair) {
          if (item.chords) {
            let { lyrics } = item
            if (lyrics.length <= item.chords.length)
              lyrics = lyrics + " ".repeat(item.chords.length - lyrics.length + 1)
            html += `<span class="chord${CHORD_SIZE_CLASS}">${item.chords}</span>${lyrics}`
          } else {
            html += `${item.lyrics}`
          }
        } else {
          if (item.name == 'comment' && item.value) {
            let comment = item.value
            comment = comment.replace(/\[([^\]]+)\]/g, (v, c) => {
              return `<span class="chord${CHORD_SIZE_CLASS} chord-inline">${c}</span>`
            })
            html += `<span class="${item.name}">${comment}</span>`
          } else if (item.name == 'x_source_website') {
            html += `<span class="${item.name}">Source website: ${item.value}</span>`
          } else if (item.name == 'artist') {
            html += `<span class="${item.name}">${item.value}</span><p><br/><br/></p>`
          } else if (item.value != null) {
            html += `<span class="${item.name}">${item.value}</span>`
          }
        }
      })
      html += `</p>`
      if (index < song.lines.length - 1) {
        html += NEW_LINE
      }
    })
    html = html.replace(/\w+(<span class="chord(.*?)<\/span>\w+)+/g, (v) => {
      return `<span class="word">${v}</span>`
    })
    return html
  }
}