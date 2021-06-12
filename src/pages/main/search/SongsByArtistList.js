import axios from 'axios';
import { Text, Container, Content, Header, Toast, Icon, Left, View } from 'native-base';
import React, {useState} from 'react';
import Loader from '../../../components/Loader';
import SongList from '../../../components/SongList';

export default function SongsByArtistList({navigation, route}){

    const [loading, setLoading] = useState(false)
    const [bandSongs, setBandSongs] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const artistId = route.params.id

    React.useEffect(()=>{
        setLoading(true)
        axios.get('https://app.desalase.id/lagu', {
            headers: {
                apa: "79fa2fcaecf5c83c299cd96e2ba44710",
            },
            params : {
                band : artistId,
                page: currentPage
            }
        })
        .then(res => {
            setBandSongs(res.data.row)
            setCurrentPage(res.data.currentPage)
        }, (error) => {
            setLoading(false)
            Toast.show({
                text: "Kesalahan Koneksi",
                buttonText: "Okay"
              })
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
        await axios.get('https://app.desalase.id/lagu', {
            headers: {
                apa: "79fa2fcaecf5c83c299cd96e2ba44710",
            },
            params : {
                band : artistId,
                page: currentPage + 1
            }
        })
        .then(res => {
            let songs = [...bandSongs];
            res.data.row.forEach(r => {
                songs.push(r)
            });
            setBandSongs(songs)
            setCurrentPage(res.data.currentPage)
            console.log("current : "+ res.data.currentPage + ", total : "+ res.data.totalPages)
            res.data.currentPage == res.data.totalPages && setLoading(false)
        }, (error) => {
            setLoading(false)
            Toast.show({
                text: "Kesalahan Koneksi",
                buttonText: "Okay"
              })
        })
    }

    return (
        <Container>
            <Loader
                loading={bandSongs!=null ? false : true} />
            <Header style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <Icon onPress={()=> navigation.pop()} style={{color:'#fff', flex:1}} type="AntDesign" size={3} name="arrowleft"/>
                <View style={{color:'#fff', flex:4, alignItems:'center'}}>
                    <Text style={{color:'#fff'}}>{route.params.name}</Text>
                </View>
                <View style={{flex:1}}></View>
            </Header>
            <View>
                <SongList songs={bandSongs} onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)} search={true} handleLoadMore={handleLoadMore} loading={loading}/>
            </View>
        </Container>
    );
    
}