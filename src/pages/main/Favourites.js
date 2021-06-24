import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import React, { useState } from 'react';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';

export default function Favourites({ navigation }) {

    const [flatListItems, setFlatListItems] = useState(null)
    const [email, setEmail] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            STORAGE.getUserInfo((data) => {
                setRefreshing(true)
                data && setEmail(data.email)
                STORAGE.getSavedList((data) => {
                    setFlatListItems(data)
                })
                setRefreshing(false)
            })
        });
        return unsubscribe;
    }, [navigation])

    const toViewSong = (e, created_by, title) => {
        navigation.navigate('ViewSong', {
            path: e,
            created: created_by,
            user: email,
            title: title
        });
    }

    const onRefresh = () => {
        setRefreshing(true)
        STORAGE.getSavedList((data) => {
            setFlatListItems(data)
        })
        setRefreshing(false)
    }

    return (
        <View style={styles.Container}>
            <SongList
                songs={flatListItems}
                onPress={(e, created_by, title) => toViewSong(e, created_by, title)}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
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