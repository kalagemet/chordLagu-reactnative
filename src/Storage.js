import AsyncStorage from '@react-native-community/async-storage';

export const getLoginStatus = async(onReceived) => {
    let loginStatus = await AsyncStorage.getItem('@login')
    onReceived(loginStatus)
}

export const setLoginStatus = async(value, onSaved) => {
    await AsyncStorage.setItem('@login', value)
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