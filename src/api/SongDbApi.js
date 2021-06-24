import axios from 'axios';
import {ToastAndroid} from 'react-native'

const toastError = () => {
    ToastAndroid.showWithGravityAndOffset(
        "Terjadi kesalahan saat mengambil data",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
    )
}

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
        toastError()
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
        toastError()
    })
}

export async function getPopular(onReceived, onError) {
    await axios.get('https://app.desalase.id/populer', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        onError()
        toastError()
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
        toastError()
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
        toastError()
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
        toastError()
    })
}

export async function getSongContent(songPath, onReceived, onError){
    axios.get('https://app.desalase.id/chord/' + songPath, {
        headers: {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        onError()
        toastError()
    })
}

function getQueryString(data = {}) {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
}

export async function postSong(data, onSuccess, onError){
    const song = { 
        judul : data.title,
        nama_band : data.artist,
        chord : data.content,
        abjad : data.abjad,
        created_by : data.created_by
    };
    const headers = { 
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    axios.post('https://app.desalase.id/post', getQueryString(song), { headers })
    .then(res => {
        if (res.data.error){
            ToastAndroid.showWithGravityAndOffset(
                res.data.msg,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            )
            onError()
        } else {
            onSuccess(res.data)
        }
    })
}

export async function getMyChords(user_id, onReceived, onError){
    axios.get('https://app.desalase.id/created', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            user_id : user_id
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        onError()
        toastError()
    })
}

export async function deleteChord(id, onSuccess, onError){
    const song = { 
        id : id
    };
    const headers = { 
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    axios.post('https://app.desalase.id/destroy', getQueryString(song), { headers })
    .then(res => {
        if (res.data.error){
            ToastAndroid.showWithGravityAndOffset(
                res.data.msg,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            )
            onError()
        } else {
            onSuccess(res.data)
        }
    })
}

export async function updateChord(data, onSuccess, onError){
    const song = { 
        id : data.id,
        nama_band : data.nama_band,
        chord : data.chord,
        judul : data.judul,
        abjad : data.abjad
    };
    const headers = { 
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    axios.post('https://app.desalase.id/update', getQueryString(song), { headers })
    .then(res => {
        onSuccess()
    }, (error) => {
        onError()
        toastError()
    })
}