import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';
import * as API from '../../api/SongDbApi';

export default function Favourites({ navigation }) {

    const [flatListItems, setFlatListItems] = useState(null)
    const [email, setEmail] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setRefreshing(true)
            getLikesList()
        });
        return unsubscribe;
    }, [navigation])

    const getLikesList = () => {
        STORAGE.getUserInfo((data) => {
            if(data){
                API.syncLocalAndApiLikes(data.email, ()=>console.log('sync success'), ()=>console.log('sync failed'))
                setEmail(data.email)
                API.getMyLikes(data.email, (data)=>{
                    console.log('dari api')
                    setFlatListItems(data.row)
                    setRefreshing(false)
                }, ()=>{
                    console.log('dari local')
                    STORAGE.getSavedList((data) => {
                        setFlatListItems(data)
                    })
                    setRefreshing(false)
                })
            }else {
                STORAGE.getSavedList((data) => {
                    setFlatListItems(data)
                })
                setRefreshing(false)
            }
        })
    }

    const toViewSong = (id) => {
        navigation.navigate('ViewSong', {
            id: id,
            user: email
        });
    }

    const onRefresh = () => {
        setRefreshing(true)
        getLikesList()
    }

    return (
        <View style={styles.Container}>
            {
                flatListItems ?
                <SongList
                    songs={flatListItems}
                    onPress={(id) => toViewSong(id)}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />      
                :
                <Text style={{alignSelf:'center', marginTop:'10%'}}>Tidak Ada Chord Favorit</Text>
            }
        </View>
    );

}

const styles = StyleSheet.create({
    Container: {
        flex: 1
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