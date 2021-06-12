import React, {useState} from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { getAllSongs } from '../../../api/SongsApi';
import Loader from '../../../components/Loader';
import SongList from '../../../components/SongList';
import { getAdStatus } from '../../../api/AdsApi';
import * as STORAGE from '../../../Storage';
import { searchArtist, searchLagu, loadMore } from '../../../api/SongDbApi';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Search({navigation}) {
    const [initialLoad, setInitialLoad] = useState(false)
    const [songs, setSongs] = useState(null)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState(null)
    const [showAds, setShowAds] = useState(false)
    const [bandSongs, setBandSongs] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [email, setEmail] = useState('')

    React.useEffect(async ()=>{
        STORAGE.getUserInfo((data)=>{
            data && setEmail(data.email)
        })
        getAdStatus((adStatus) => {
            setShowAds(adStatus.searchBannerAd)
        })
    },[navigation])

    const onSongsReceived = async(songList) => {
        let l = [];
        searchArtist(query, (data) => {
            setSongs(data)
            l = data;
            songList.forEach(song => {
                l.push(song)
            });
        })
        
        searchLagu(query, (data) => {
            const songs = data.row;
            songs.forEach(song => {
                l.push(song)
            });
            let i=1;
            l.forEach(list => {
                list.key = i;
                i++;
            })
            setList(l)
            setInitialLoad(false)
            data.currentPage >= data.totalPages && setLoading(false)
        })
    }

    const searchSong = () => {
        if(query!=''){
            setCurrentPage(0)
            setInitialLoad(true)
            setLoading(true)

            let strSearch = query.toLowerCase();
            let strlength = strSearch.length;
            let strFrontCode = strSearch.slice(0, strlength-1);
            let strEndCode = strSearch.slice(strlength-1, strSearch.length);

            let startcode = strSearch;
            let endcode= strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
            
            getAllSongs(startcode, endcode ,onSongsReceived);
        }
    }

    const toViewSong = (e, typeApi, created_by, title) => {
        navigation.navigate('ViewSong', {
                path: e,
                type : typeApi,
                created : created_by,
                user : email,
                title : title
            });
    }

    const getSongsByArtist = (id, name) => {
        navigation.navigate('SongsByArtistList', {
            id : id,
            name : name
        });
    }

    const handleLoadMore= async()=>{
        loadMore(query, currentPage, (data) => {
            let songs = [...list];
            data.row.forEach(r => {
                songs.push(r)
            });
            setList(songs)
            setCurrentPage(data.currentPage)
            console.log("currentState : "+ currentPage)
            console.log("current : "+ data.currentPage + ", total : "+ data.totalPages)
            data.currentPage >= data.totalPages && setLoading(false)
        })
    }

    return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
        <Loader loading={initialLoad} />
        <View style={{flexDirection:'row', elevation:20, margin:'5%', backgroundColor:'#fff', alignItems:'center', borderRadius:30}}>
            <Ionicons name='search' style={{marginHorizontal:'5%', fontSize:27}} />
            <TextInput 
                onEndEditing={searchSong}
                onChangeText={(text) => setQuery(text) }
                placeholder='Cari Chord'
                style={{width:'75%'}}
            />
        </View>
        <SongList 
            songs={list} 
            onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)} 
            onArtistPress={(id, name)=> getSongsByArtist(id, name)} 
            handleLoadMore={()=>handleLoadMore()} 
            loading={loading}
            search
        />
    </View>
    );
    
}

const styles = StyleSheet.create({
    content: {
        padding : 10
    }
  })