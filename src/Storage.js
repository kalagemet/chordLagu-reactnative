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

export const getLocalAppVersion = async(onReceived) => {
    let localAppVersion= await AsyncStorage.getItem('@version')
    onReceived(localAppVersion)
}

export const setLocalAppVersion = async(value, onSaved) => {
    let string = value.toString()
    await AsyncStorage.setItem('@version', string)
    .then(()=>{
        onSaved()
    })
}

export const setRequestNotifications = async(data) => {
    let saved = await AsyncStorage.getItem("@requestNotifications")
    let isi = [
        {
            item : data.item,
            item_id : data.item_id,
            message: data.message,
            timestamp : data.timestamp,
            read : data.read
        },
    ]
    if(saved != null){
        saved = JSON.parse(saved)
        isi = isi.concat([...saved])
    }
    await AsyncStorage.setItem("@requestNotifications", JSON.stringify(isi))
    .then(
        console.log("notif added")
    )
    .catch((err) => console.error(err))
}

export const updateRequestNotification = async (data) => {
    await AsyncStorage.setItem("@requestNotifications", JSON.stringify(data))
    .then(
        console.log('updated')
    )
    .catch((err) => console.error(err))
}

export const getRequestNotifications = async(onReceived) => {
    let saved = await AsyncStorage.getItem("@requestNotifications")
    saved = JSON.parse(saved)
    onReceived(saved)
}

export const getNumberOfUnreadNotification = async(onReceived) => {
    let notifications = await AsyncStorage.getItem("@requestNotifications")
    notifications = JSON.parse(notifications)
    let num = 0;
    notifications && notifications.forEach( notification => {
        if(!notification.read){
            num ++;
        }
    });
    onReceived(num);
}