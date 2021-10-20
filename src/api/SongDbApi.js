import axios from 'axios';
import {ToastAndroid} from 'react-native';
import * as STORAGE from '../Storage';
import {getSettings} from './AdsApi';

const toastError = () => {
    ToastAndroid.showWithGravityAndOffset(
        "Terjadi Kesalahan, tidak dapat mengambil data",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
    )
}

export function searchArtist(query, onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'band', {
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
    })
}

export function searchLagu(query, onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'cari', {
            headers: {
                apa: "79fa2fcaecf5c83c299cd96e2ba44710",
            },
            params : {
                string : query
            }
        })
        .then(res => {
            console.log(res.data)
            onReceived(res.data)
        }, (error) => {
            onError()
            toastError()
        })
    })
}

export function getPopular(onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'populer', {
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
    })
}

export function getTerbaru(onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'terbaru', {
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
    })
}

export function loadMore(query, currentPage, onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'cari', {
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
    })
}

export function getSongsByArtist(id, currentPage, onReceived, onError){
    getSettings(async(setting)=>{
        await axios.get(setting.host+'lagu', {
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
    })
}

export function loadMoreByArtist(id, currentPage, onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'lagu', {
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
    })
}

export function getSongContent(songPath, onReceived, onError){
    getSettings(async(setting)=>{
        await axios.get(setting.host+'chord/' + songPath, {
            headers: {
            apa: "79fa2fcaecf5c83c299cd96e2ba44710",
            }
        })
        .then(res => {
            onReceived(res.data)
        }, (error) => {
            onError()
        })
    })
}

export function getTerkait(songPath, onReceived, onError){
    getSettings(async(setting)=>{
        await axios.get(setting.host+'terkait/' + songPath, {
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
    })
}

function getQueryString(data = {}) {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
}

export function postSong(data, onSuccess, onError){
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
    getSettings(async(setting)=>{
        await axios.post(setting.host+'post', getQueryString(song), { headers })
        .then(res => {
            if (res.data.error){
                toastError(res.data.msg)
                onError()
            } else {
                onSuccess(res.data)
            }
        })
    })
}

export function getMyChords(user_id, onReceived, onError){
    getSettings(async(setting)=>{
        await axios.get(setting.host+'created', {
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
    })
}

export function loadMoreMyChords(user_id, currentPage, onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'created', {
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
    })
}

export function deleteChord(id, onSuccess, onError){
    const song = { 
        id : id
    };
    const headers = {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    getSettings(async(setting)=>{
        await axios.delete(setting.host+'destroy', {data:getQueryString(song), headers:headers})
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
    })
}

export function updateChord(data, onSuccess, onError){
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
    getSettings(async(setting)=>{
        await axios.put(setting.host+'update', getQueryString(song), { headers })
        .then(res => {
            onSuccess()
        }, (error) => {
            onError()
            toastError()
        })
    })
}

export function like(data, onSuccess, onError){
    const prop = {
        id_chord : data.id_chord,
        id_user : data.id_user
    };
    const headers = {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    getSettings(async(setting)=>{
        await axios.post(setting.host+'sukai', getQueryString(prop), { headers })
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
    })
}

export function unLike(data, onSuccess, onError){
    const prop = { 
        id_chord : data.id_chord,
        id_user : data.id_user
    };
    const headers = { 
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    getSettings(async(setting)=>{
        await axios.post(setting.host+'batalsuka', getQueryString(prop), { headers })
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
    })
}

export function getMyLikes(user_id, onReceived, onError){
    console.log(user_id)
    getSettings(async(setting)=>{
        await axios.get(setting.host+'disukai', {
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
    })
}

export function loadMoreMyLikes(user_id, currentPage, onReceived, onError) {
    getSettings(async(setting)=>{
        await axios.get(setting.host+'disukai', {
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