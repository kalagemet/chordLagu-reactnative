import axios from 'axios';
import {Toast} from 'native-base';

export async function searchArtist(query) {
    await axios.get('https://app.desalase.id/band', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            string : query
        }
    })
    .then(res => {
        return res.data.row
    }, (error) => {
        this.setState({initialLoad: false, list : this.state.songs})
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function searchSong(query) {
    await axios.get('https://app.desalase.id/cari', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            string : query
        }
    })
    .then(res => {
        return res.data.row
    }, (error) => {
        this.setState({initialLoad: false, list : this.state.songs})
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}