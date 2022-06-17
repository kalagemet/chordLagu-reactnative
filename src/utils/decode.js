import chords from "../assets/chords/guitar.json";

export const decode = (isi) => {
  var data = isi;
  //let chords = [ ...Chord, ...Chord2, ...Chord3, ...Chord4, ...Chord5, ...Chord6 ]

  data = data.replace(/Gb/g, "F#");
  data = data.replace(/Ab/g, "G#");
  data = data.replace(/Bb/g, "A#");
  data = data.replace(/Db/g, "C#");
  data = data.replace(/Eb/g, "D#");
  data = data.replace(/A:s1:([a-z])/g, "a:s1:$1");
  let string = data.split(":");
  string = [...new Set(string)];
  for (var i = 0; i < string.length; i++) {
    if (chords[string[i]]) {
      let re = new RegExp(":" + string[i] + ":", "g");
      data = data.replace(re, `:<span class="chord">${string[i]}</span>:`);
    }
  }
  // chords.forEach(chord => {
  //   let re = new RegExp(":(" + chord + ")(.*?):","g");
  //   data = data.replace(re, `:<span class="chord">$1$2</span>:`)
  // })
  //data = data.replace(/:([A-Z])(.*?):/g, `:<span class="chord">$1$2</span>:`);
  data = data.replace(/:s1:-:s1:/g, "&#32;-&#32;");
  data = data.replace(
    /:s10:/g,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"
  );
  data = data.replace(
    /:s9:/g,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"
  );
  data = data.replace(
    /:s8:/g,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;"
  );
  data = data.replace(/:s7:/g, "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;");
  data = data.replace(/:s6:/g, "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;");
  data = data.replace(/:s5:/g, "&ensp;&ensp;&ensp;&ensp;&ensp;");
  data = data.replace(/:s4:/g, "&ensp;&ensp;&ensp;&ensp;");
  data = data.replace(/:s3:/g, "&ensp;&ensp;&ensp;");
  data = data.replace(/:s2:/g, "&ensp;&ensp;");
  data = data.replace(/:s1:/g, "&ensp;");
  data = data.replace(/:x5:/g, "<br><br><br><br><br>");
  data = data.replace(/:x4:/g, "<br><br><br><br>");
  data = data.replace(/:x3:/g, "<br><br><br>");
  data = data.replace(/:x2:/g, "<br><br>");
  data = data.replace(/:x1:/g, "<br>");
  return data;
};

export const decodeToPlainText = (isi) => {
  var data = isi;

  data = data.replace(/:s10:/g, "          ");
  data = data.replace(/:s9:/g, "         ");
  data = data.replace(/:s8:/g, "        ");
  data = data.replace(/:s7:/g, "       ");
  data = data.replace(/:s6:/g, "      ");
  data = data.replace(/:s5:/g, "     ");
  data = data.replace(/:s4:/g, "    ");
  data = data.replace(/:s3:/g, "   ");
  data = data.replace(/:s2:/g, "  ");
  data = data.replace(/:s1:/g, " ");
  data = data.replace(/:x5:/g, "\n\n\n\n\n");
  data = data.replace(/:x4:/g, "\n\n\n\n");
  data = data.replace(/:x3:/g, "\n\n\n");
  data = data.replace(/:x2:/g, "\n\n");
  data = data.replace(/:x1:/g, "\n");
  return data;
};
