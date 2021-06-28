import React, {useState} from 'react';
import { View, Text } from 'react-native';
import SongList from '../../../components/SongList';
import * as API from '../../../api/SongDbApi';

export default function MyChords({navigation, route}) {
    const [flatListItems, setFlatListItems] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const userEmail = route.params.user

    React.useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getListSongs()
        });
        return unsubscribe;
    },[navigation])

    const getListSongs = () => {
        setRefreshing(true)
        API.getMyChords(userEmail, onSongsReceived, ()=>console.log('error'))
    }

    const onSongsReceived = (songList) => {
      setFlatListItems(songList.row)
      setRefreshing(false)
    }

    const toViewSong = (id) => {
        navigation.navigate('ViewSong', {
            id: id,
            user : userEmail
        });
    }

    const onRefresh = () => {
        setRefreshing(true)
        getListSongs()
    }

    return (
        <View style={{flex:1}}>
            <SongList
                songs={flatListItems}
                onPress={(id) => toViewSong(id)}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
    
}