import { View } from 'react-native';
import React, {useState} from 'react';
import Loader from '../../../components/Loader';
import SongList from '../../../components/SongList';
import { getSongsByArtist, loadMoreByArtist } from '../../../api/SongDbApi';

export default function SongsByArtistList({navigation, route}){

    const [loading, setLoading] = useState(false)
    const [bandSongs, setBandSongs] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const artistId = route.params.id
    const [refreshing, setRefreshing] = useState(false)

    React.useEffect(()=>{
        console.log(artistId)
        setLoading(true)
        getSongsByArtist(artistId, currentPage, (data) => {
            setBandSongs(data.row)
            setCurrentPage(data.currentPage)
        }, () => {
            setLoading(false)
        })
    },[navigation])

    const toViewSong = (e, typeApi, created_by, title) => {
        navigation.navigate('ViewSong', {
                path: e,
                type : typeApi,
                created : created_by,
                title : title
            });
    }

    const handleLoadMore= async()=>{
        loadMoreByArtist(artistId, currentPage, (data) => {
            let songs = [...bandSongs];
            data.row.forEach(r => {
                songs.push(r)
            });
            setBandSongs(songs)
            setCurrentPage(data.currentPage)
            console.log("current : "+ data.currentPage + ", total : "+ data.totalPages)
            data.currentPage == data.totalPages && setLoading(false)
        }, () => {
            setLoading(false)
        })
    }

    const onRefresh = () => {
        setRefreshing(true)
        getSongsByArtist(artistId, currentPage, (data) => {
            setBandSongs(data.row)
            setCurrentPage(data.currentPage)
            setRefreshing(false)
        }, () => {
            setRefreshing(false)
        })
    }

    return (
        <View style={{flex:1, backgroundColor:'#fff'}}>
            <Loader
                loading={bandSongs!=null ? false : true} />
            <View>
                <SongList 
                    songs={bandSongs} 
                    onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)} 
                    search={true} 
                    handleLoadMore={handleLoadMore} 
                    loading={loading}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            </View>
        </View>
    );
    
}