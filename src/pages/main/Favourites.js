import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import React, { useState } from 'react';
import { getFavourited } from '../../api/SongsApi';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';
import Button from '../../components/Button';

export default function Favourites({ navigation }) {

    const [flatListItems, setFlatListItems] = useState(null)
    const [email, setEmail] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [isFinishGetFav, setIsFinishGetFav] = useState(false)
    const [list, setList] = useState([])

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            STORAGE.getUserInfo((data) => {
                setRefreshing(true)
                if (data) {
                    setEmail(data.email)
                    getFavourited(data.email, onFavouriteLoaded)
                } else {
                    STORAGE.getSavedList((data) => {
                        setFlatListItems(data)
                    })
                    setRefreshing(false)
                }
            })
        });
        return unsubscribe;
    }, [navigation])

    React.useEffect(() => {
        STORAGE.getSavedList((data) => {
            data ?
            setFlatListItems([...list, ...data])
            :
            setFlatListItems(list)
        })
        setRefreshing(false)
    }, [list])

    const onFavouriteLoaded = (songList) => {
        setList(songList)
    }

    const toViewSong = (e, typeApi, created_by, title) => {
        navigation.navigate('ViewSong', {
            path: e,
            type: typeApi,
            created: created_by,
            user: email,
            title: title
        });
    }

    const toLogin = () => {
        navigation.navigate("Login")
    }

    const onRefresh = () => {
        setRefreshing(true)
        getFavourited(email, onFavouriteLoaded)
    }

    return (
        <View style={styles.Container}>
            <SongList
                songs={flatListItems}
                onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            {/* {
                email ?
                
                :
                <View style={styles.LoginContainer}>
                    <Text style={styles.TextInfo}>Login untuk melihat daftar favorit</Text>
                    <Button name='Login' onPress={toLogin} />
                </View>
            } */}
        </View>
    );

}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    LoginContainer: {
        height: '70%',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    TextInfo: {
        color: 'grey',
        marginTop: '5%',
        marginBottom: '5%'
    }
})