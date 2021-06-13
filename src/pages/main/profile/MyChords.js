import React, {useState} from 'react';
import { View } from 'react-native';
import { getSongs } from '../../../api/SongsApi';
import SongList from '../../../components/SongList';

export default function MyChords({navigation, route}) {
    const [flatListItems, setFlatListItems] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const userEmail = route.params.user

    React.useEffect(()=>{
        getListSongs()
    },[navigation])

    const getListSongs = () => {
        setRefreshing(true)
        getSongs(userEmail, onSongsReceived);
    }

    const onSongsReceived = (songList) => {
      setFlatListItems(songList)
      setRefreshing(false)
    }

    const toViewSong = (e, typeApi, created_by, title) => {
        navigation.navigate('ViewSong', {
            path: e,
            type : typeApi,
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
        <View style={{flex:1, backgroundColor:'#fff'}}>
            <SongList 
                songs={flatListItems} 
                onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
    
}