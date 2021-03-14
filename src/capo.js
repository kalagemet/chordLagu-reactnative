const Chord = [
  "Am",
  "A#m",
  "Bm",
  "Cm",
  "C#m",
  "Dm",
  "D#m",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
];
const Chord2 = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];
const Chord3 = [
  "A7",
  "A#7",
  "B7",
  "C7",
  "C#7",
  "D7",
  "D#7",
  "E7",
  "F7",
  "F#7",
  "G7",
  "G#7",
];
const Chord4 = [
  "AMaj7",
  "A#Maj7",
  "BMaj7",
  "CMaj",
  "C#Maj",
  "DMaj7",
  "D#Maj7",
  "EMaj7",
  "FMaj7",
  "F#Maj7",
  "GMaj7",
  "G#Maj7",
];
const Chord5 = [
  "Amaj7",
  "A#maj7",
  "Bmaj7",
  "Cmaj7",
  "C#maj7",
  "Dmaj7",
  "D#maj7",
  "Emaj7",
  "Fmaj7",
  "F#maj7",
  "Gmaj7",
  "G#maj7",
];
const Chord6 = [
  "A5",
  "A#5",
  "B5",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
];

export const capoUp = (isi) => {
  var data = replace(isi, Chord);
  data = replace(data, Chord2);
  data = replace(data, Chord3);
  data = replace(data, Chord4);
  data = replace(data, Chord5);
  data = replace(data, Chord6);
  return data;
};

export const capoDown = (isi) => {
  var data = replaceDown(isi, Chord);
  data = replaceDown(data, Chord2);
  data = replaceDown(data, Chord3);
  data = replaceDown(data, Chord4);
  data = replaceDown(data, Chord5);
  data = replaceDown(data, Chord6);
  return data;
};

const replace = (isi, array) => {
  var data = isi.toString();
  let kunci = [...array];

  for (let i = kunci.length - 1; i >= 0; i--) {
    //1
    let testVar = "<span>" + kunci[i] + "</span>";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + i + "</span>");
    //2
    testVar = "<span>" + kunci[i] + "/";
    reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + i + "/");
    //3
    testVar = "/" + kunci[i] + "</span>";
    reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "/" + i + "</span>");
  }

  kunci.push(kunci[0]);
  kunci.shift();
  for (let i = kunci.length - 1; i >= 0; i--) {
    //1
    let testVar = "<span>" + i + "</span>";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + kunci[i] + "</span>");
    //2
    testVar = "<span>" + i + "/";
    reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + kunci[i] + "/");
    //3
    testVar = "/" + i + "</span>";
    reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "/" + kunci[i] + "</span>");
  }

  return data;
};

const replaceDown = (isi, array) => {
  var data = isi.toString();
  let kunci = [...array];
  //1
  for (let i = kunci.length - 1; i >= 0; i--) {
    let testVar = "<span>" + kunci[i] + "</span>";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + i + "</span>");
  }

  kunci = [kunci[kunci.length - 1]].concat(kunci);
  kunci.pop();
  for (let i = kunci.length - 1; i >= 0; i--) {
    let testVar = "<span>" + i + "</span>";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + kunci[i] + "</span>");
  }
  //2
  kunci = [...array];

  for (let i = kunci.length - 1; i >= 0; i--) {
    let testVar = "<span>" + kunci[i] + "/";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + i + "/");
  }

  kunci = [kunci[kunci.length - 1]].concat(kunci);
  kunci.pop();
  for (let i = kunci.length - 1; i >= 0; i--) {
    let testVar = "<span>" + i + "/";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "<span>" + kunci[i] + "/");
  }
  //3
  kunci = [...array];

  for (let i = kunci.length - 1; i >= 0; i--) {
    let testVar = "/" + kunci[i] + "</span>";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "/" + i + "</span>");
  }

  kunci = [kunci[kunci.length - 1]].concat(kunci);
  kunci.pop();
  for (let i = kunci.length - 1; i >= 0; i--) {
    let testVar = "/" + i + "</span>";
    const reg = RegExp(`${testVar}`, "g");
    data = data.replace(reg, "/" + kunci[i] + "</span>");
  }

  return data;
};
