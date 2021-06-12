import axios from 'axios';
import {Toast} from 'native-base';

export async function searchArtist(query, onReceived) {
    await axios.get('https://app.desalase.id/band', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            string : query
        }
    })
    .then(res => {
        onReceived(res.data.row)
    }, (error) => {
        this.setState({initialLoad: false, list : this.state.songs})
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function searchLagu(query, onReceived) {
    await axios.get('https://app.desalase.id/cari', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            string : query
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        this.setState({initialLoad: false, list : this.state.songs})
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function getPopular(onReceived) {
    await axios.get('https://app.desalase.id/populer', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        this.setState({initialLoad: false, list : this.state.songs})
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function loadMore(query, currentPage, onReceived) {
    await axios.get('https://app.desalase.id/cari', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            string : query,
            page: currentPage + 1
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        setInitialLoad(false)
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
        })
    })
}