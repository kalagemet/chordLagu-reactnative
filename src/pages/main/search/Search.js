import axios from 'axios';
import { Button, Container, Content, Header, Icon, Input, Item, Toast, View } from 'native-base';
import React, {useState} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { getAllSongs } from '../../../api/SongsApi';
import Loader from '../../../components/Loader';
import SongList from '../../../components/SongList';
import { getAdStatus } from '../../../api/AdsApi';
import * as STORAGE from '../../../Storage';

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
        await axios.get('https://app.desalase.id/band', {
            headers: {
                apa: "79fa2fcaecf5c83c299cd96e2ba44710",
            },
            params : {
                string : query
            }
        })
        .then(res => {
            setSongs(res.data.row)
            l = res.data.row;
            songList.forEach(song => {
                l.push(song)
            });
        }, (error) => {
            setInitialLoad(false)
            setList(songs)
            Toast.show({
                text: "Kesalahan Koneksi",
                buttonText: "Okay"
            })
        })

        await axios.get('https://app.desalase.id/cari', {
            headers: {
                apa: "79fa2fcaecf5c83c299cd96e2ba44710",
            },
            params : {
                string : query
            }
        })
        .then(res => {
            const songs = res.data.row;
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
            res.data.currentPage >= res.data.totalPages && setLoading(false)
        }, (error) => {
            setInitialLoad(false)
            setList(songList)
            Toast.show({
                text: "Kesalahan Koneksi",
                buttonText: "Okay"
            })
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
        await axios.get('https://app.desalase.id/cari', {
            headers: {
                apa: "79fa2fcaecf5c83c299cd96e2ba44710",
            },
            params : {
                string : query,
                page: currentPage + 1
            }
        })
        .then(res => {
            let songs = [...list];
            res.data.row.forEach(r => {
                songs.push(r)
            });
            setList(songs)
            setCurrentPage(res.data.currentPage)
            console.log("currentState : "+ currentPage)
            console.log("current : "+ res.data.currentPage + ", total : "+ res.data.totalPages)
            res.data.currentPage >= res.data.totalPages && setLoading(false)
        }, (error) => {
            setInitialLoad(false)
            Toast.show({
                text: "Kesalahan Koneksi",
                buttonText: "Okay"
            })
        })
    }

    return (
    <Container>
        <Loader
            loading={initialLoad} />
        <Header searchBar>
            <Item rounded>
                <Input placeholder='Cari Chord' onChangeText={(query) => setQuery(query)} onEndEditing={searchSong}/>
                <TouchableOpacity onPress={searchSong}>
                    <Icon name='search' fontSize={29}/>
                </TouchableOpacity>
            </Item>
        </Header>
        <SongList 
            songs={list} 
            onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)} 
            onArtistPress={(id, name)=> getSongsByArtist(id, name)} 
            handleLoadMore={()=>handleLoadMore()} 
            loading={loading}
            search
        />
    </Container>
    );
    
}

const styles = StyleSheet.create({
    content: {
        padding : 10
    }
  })