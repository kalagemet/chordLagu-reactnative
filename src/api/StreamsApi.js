import axios from 'axios';
import {Toast} from 'native-base';
import firestore from '@react-native-firebase/firestore';

export async function getStreamsBySearch(search, streamsRetreived) {

    let songList;
    let limit = await firestore()
      .collection('stream')
      .doc('list')
      .get()

    let clientId = await firestore()
      .collection('stream')
      .doc('clientId')
      .get()

    axios.get('https://api-v2.soundcloud.com/search/tracks', {
        params : {
            q : search,
            client_id : clientId.data().value,
            limit : limit.data().limit
        }
    })
    .then(res => {
        streamsRetreived(res.data);
        songList = res.data;
    }, (error) => {
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
    
}