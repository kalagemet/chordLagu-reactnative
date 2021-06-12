import { Container, View, Header, Title } from 'native-base';
import React, {useState} from 'react';
import { RefreshControl, ScrollView } from 'react-native';
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
        this.props.navigation.navigate('ViewSong', {
            path: e,
            type : typeApi,
            created : created_by,
            user : userEmail,
            title : title
        });
    }

    return (
        <View>
        
            <Header style={{alignItems:'center', justifyContent:'flex-start'}}>
                <Title>Chord Saya</Title>
            </Header>
            <SongList songs={flatListItems} onPress={(e, typeApi, created_by, title) => this.toViewSong(e, typeApi, created_by, title)}/>
        </View>
    );
    
}