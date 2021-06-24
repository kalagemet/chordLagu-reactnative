import React, {useState} from 'react';
import { View } from 'react-native';
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

    const toViewSong = (e, created_by, title) => {
        navigation.navigate('ViewSong', {
            path: e,
            created : created_by,
            user : userEmail,
            title : title
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
                onPress={(e,created_by, title) => toViewSong(e, created_by, title)}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
    
}