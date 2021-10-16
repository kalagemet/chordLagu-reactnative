import Recording from "react-native-recording";
import PitchFinder from "pitchfinder";

export default class TunerContainer {
  middleA = 440;
  semitone = 69;
  noteStrings = [
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "A♯",
    "B"
  ];

  constructor(sampleRate = 22050, bufferSize = 2048) {
    this.sampleRate = sampleRate;
    this.bufferSize = bufferSize;
    this.pitchFinder = new PitchFinder.YIN({ sampleRate: this.sampleRate });
  }

  start() {
    Recording.init({
      sampleRate: 22050,
      bufferSize: 2048
    });
    Recording.start();
    this.listener = Recording.addRecordingEventListener(data => {
      const frequency = this.pitchFinder(data);
      if (frequency && this.onNoteDetected) {
        let note = 0;
        if(frequency < 96){
          note = 40
        }else if(frequency < 128){
          note = 45
        }else if(frequency < 171){
          note = 50
        }else if(frequency < 221){
          note = 55
        }else if(frequency < 289){
          note = 59
        }else{
          note = 64
        }
        
        this.onNoteDetected({
          name: this.noteStrings[note % 12],
          value: note,
          cents: this.getCents(frequency, note),
          octave: parseInt(note / 12) - 1,
          frequency: frequency
        });
      }
    });
  }

  stop(){
    Recording.stop();
    this.listener.remove();
  }

  /**
   * get musical note from frequency
   *
   * @param {number} frequency
   * @returns {number}
   */
  getNote(frequency) {
    const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
    return Math.round(note) + this.semitone;
  }

  /**
   * get the musical note's standard frequency
   *
   * @param note
   * @returns {number}
   */
  getStandardFrequency(note) {
    return this.middleA * Math.pow(2, (note - this.semitone) / 12);
  }

  /**
   * get cents difference between given frequency and musical note's standard frequency
   *
   * @param {float} frequency
   * @param {int} note
   * @returns {int}
   */
  getCents(frequency, note) {
    let cents = Math.floor(
      (1200 * Math.log(frequency / this.getStandardFrequency(note))) /
        Math.log(2)
    );
    if (cents < -50){
      cents = -50
    }else if(cents > 50){
      cents = 50
    }
    return cents;
  }
}
