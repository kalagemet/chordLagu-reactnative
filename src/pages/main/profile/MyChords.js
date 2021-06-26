import React, {useState} from 'react';
import { View, Text } from 'react-native';
import SongList from '../../../components/SongList';
import * as API from '../../../api/SongDbApi';

export default function MyChords({navigation, route}) {
    const [flatListItems, setFlatListItems] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const userEmail = route.params.user

    React.useEffect(()=>{
        getListSongs()
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
            {
                flatListItems.totalItems > 0 ?
                <SongList
                    songs={flatListItems}
                    onPress={(id) => toViewSong(id)}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />      
                :
                <Text style={{alignSelf:'center', marginTop:'10%'}}>Tidak Ada Chord</Text>
            }
        </View>
    );
    
}