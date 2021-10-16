import React, {useState} from 'react';
import { View, Text } from 'react-native';
import SongList from '../../../components/SongList';
import * as API from '../../../api/SongDbApi';

export default function MyChords({navigation, route}) {
    const [flatListItems, setFlatListItems] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const userEmail = route.params.user
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(false)

    React.useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getListSongs()
        });
        return unsubscribe;
    },[navigation])

    const getListSongs = () => {
        setLoading(true)
        setRefreshing(true)
        API.getMyChords(userEmail, onSongsReceived, ()=>console.log('error'))
    }

    const onSongsReceived = (songList) => {
        if(songList.totalItems > 0){
            setFlatListItems(songList.row)
            setRefreshing(false)
        } else{
            setRefreshing(false)
            setLoading(false)
        }
    }

    const handleLoadMore = async () => {
        API.loadMoreMyChords(userEmail, currentPage, (data) => {
            let songs = [...flatListItems];
            data.row.forEach(r => {
                songs.push(r)
            });
            setFlatListItems(songs)
            setCurrentPage(data.currentPage)
            console.log("current : " + data.currentPage + ", total : " + data.totalPages)
            data.currentPage >= data.totalPages && setLoading(false)
        }, () => {
            setLoading(false)
        })
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
                handleLoadMore={handleLoadMore}
                loading={loading}
                paginate={true}
            />
        </View>
    );
    
}