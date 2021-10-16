import axios from 'axios';
import {ToastAndroid} from 'react-native';
import * as STORAGE from '../Storage';

const toastError = () => {
    ToastAndroid.showWithGravityAndOffset(
        "Koneksi Bermasalah",
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

export async function getTerbaru(onReceived, onError) {
    await axios.get('https://app.desalase.id/terbaru', {
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
    })
}

export async function getTerkait(songPath, onReceived, onError){
    axios.get('https://app.desalase.id/terkait/' + songPath, {
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
            toastError(res.data.msg)
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

export async function loadMoreMyChords(user_id, currentPage, onReceived, onError) {
    await axios.get('https://app.desalase.id/created', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            user_id : user_id,
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

export async function deleteChord(id, onSuccess, onError){
    const song = { 
        id : id
    };
    const headers = {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    axios.delete('https://app.desalase.id/destroy', {data:getQueryString(song), headers:headers})
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
    }).catch((e)=>{
        console.log(e)
        onError()
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
    axios.put('https://app.desalase.id/update', getQueryString(song), { headers })
    .then(res => {
        onSuccess()
    }, (error) => {
        onError()
        toastError()
    })
}

export async function like(data, onSuccess, onError){
    const prop = {
        id_chord : data.id_chord,
        id_user : data.id_user
    };
    const headers = {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    axios.post('https://app.desalase.id/sukai', getQueryString(prop), { headers })
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
    }, (error) => {
        onError()
    })
}

export async function unLike(data, onSuccess, onError){
    const prop = { 
        id_chord : data.id_chord,
        id_user : data.id_user
    };
    const headers = { 
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    axios.post('https://app.desalase.id/batalsuka', getQueryString(prop), { headers })
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
    }, (error) => {
        onError()
    })
}

export async function getMyLikes(user_id, onReceived, onError){
    console.log(user_id)
    axios.get('https://app.desalase.id/disukai', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            id_user : user_id
        }
    })
    .then(res => {
        onReceived(res.data)
    }, (error) => {
        onError()
        toastError()
    })
}

export async function loadMoreMyLikes(user_id, currentPage, onReceived, onError) {
    await axios.get('https://app.desalase.id/disukai', {
        headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        },
        params : {
            id_user : user_id,
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

export function syncLocalAndApiLikes(user_id, onSuccess, onError){
    let local = []
    let api = []
    STORAGE.getSavedList((data)=>{
        data && data.forEach(item =>{
            local = [...local, item.id]
        })
    })

    let current=-1
    let max=0
    do {
        loadMoreMyLikes(user_id,current, (data)=>{
            data.row.forEach(item => {
                api = [...api, item.id]
            })
            max = data.totalPages
            current = data.currentPage
            if(current>=max){
                let b = new Set(local);
                let difference = [...api].filter(x => !b.has(x));
                console.log("diff "+difference)
                console.log(difference)
                difference.forEach(item => {
                    getSongContent(item, (data) => {
                        STORAGE.saveSong(data, ()=> console.log(item+' saved'))
                    },()=>console.log(item+' failed to save'))
                });
                onSuccess()
            }
        },()=>onError())
        current++
    } while(current <= max)
}