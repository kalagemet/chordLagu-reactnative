import AsyncStorage from '@react-native-community/async-storage';

export const getLoginStatus = async(onReceived) => {
    let loginStatus = await AsyncStorage.getItem('@login')
    let isTrue = (loginStatus === 'true')
    onReceived(isTrue)
}

export const setLoginStatus = async(value, onSaved) => {
    let string = value.toString()
    await AsyncStorage.setItem('@login', string)
    .then(()=>{
        onSaved()
    })
}

export const setUserInfo = async(value, onSaved) => {
    let string = JSON.stringify(value)
    await AsyncStorage.setItem('@userInfo', string)
    .then(()=>{
        onSaved()
    })
}

export const getUserInfo = async(onReceived) => {
    let userInfo = await AsyncStorage.getItem('@userInfo')
    userInfo = JSON.parse(userInfo)
    onReceived(userInfo)
}

const setSavedList = async(data) => {
    let saved = await AsyncStorage.getItem("@saved")
    let isi = [
        {
            id: data.id,
            judul: data.judul,
            nama_band: data.nama_band,
            created_by: data.created_by,
            downloaded: true
        },
    ]
    if(saved != null){
        saved = JSON.parse(saved)
        isi = [...saved].concat(isi)
    }
    await AsyncStorage.setItem("@saved", JSON.stringify(isi))
}

export const getSavedList = async (onReceived) => {
    let list = await AsyncStorage.getItem('@saved')
    list = JSON.parse(list)
    onReceived(list)
}

export const saveSong = async(value, onSaved) => {
    setSavedList(value)
    let string = JSON.stringify(value)
    await AsyncStorage.setItem('@'+value.id, string)
    .then(()=>{
        onSaved()
    })
}

export const getSavedSong = async (id, onReceived) => {
    let song = await AsyncStorage.getItem('@'+id)
    song = JSON.parse(song)
    onReceived(song)
}

export const deleteSaved = async (id, onDeleted)=> {
    await AsyncStorage.setItem('@'+id, '')
    let saved = await AsyncStorage.getItem("@saved")
    saved = JSON.parse(saved)
    saved = saved.filter((item) => { return item.id != id })
    await AsyncStorage.setItem("@saved", JSON.stringify(saved))
    .then(
        onDeleted()
    )
}

export const updateSaved = async (data, onUpdated) => {
    deleteSaved(data.id, () => {
        saveSong(data, ()=>{
            onUpdated()
        })
    })
}
