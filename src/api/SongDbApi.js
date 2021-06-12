import axios from 'axios';
import {Toast} from 'native-base';

export async function searchArtist(query, onReceived, onError) {
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
        onError()
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function searchLagu(query, onReceived, onError) {
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
        onError()
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
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function loadMore(query, currentPage, onReceived, onError) {
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
        onError()
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
        })
    })
}

export async function getSongsByArtist(id, currentPage, onReceived, onError){
    axios.get('https://app.desalase.id/lagu', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            band : id,
            page: currentPage
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        onError()
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function loadMoreByArtist(id, currentPage, onReceived, onError) {
    await axios.get('https://app.desalase.id/lagu', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            band : id,
            page: currentPage + 1
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        onError()
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
            })
    })
}

export async function getSongContent(songPath, onReceived){
    axios.get('https://app.desalase.id/chord/' + songPath, {
        headers: {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        Toast.show({
            text: "Kesalahan Koneksi",
            buttonText: "Okay"
        })
    })
}