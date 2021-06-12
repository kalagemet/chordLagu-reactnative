import { StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import React, {useState} from 'react';
import { getFavourited } from '../../api/SongsApi';
import SongList from '../../components/SongList';
import * as STORAGE from '../../Storage';

export default function Favourites({navigation}) {

    const [flatListItems, setFlatListItems] = useState(null)
    const [email, setEmail] = useState('')

    React.useEffect(()=>{
        STORAGE.getUserInfo((data)=>{
            if(data){
                setEmail(data.email)
                getFavourited(data.email, onFavouriteLoaded)
            }
        })
    },[navigation])

    const onFavouriteLoaded = (songList) => {
        setFlatListItems(songList)
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
    
    const toLogin = () => {
        navigation.navigate("Login")
    }

    
    return (
        <View style={styles.Container}>
            {
                email ?
                <SongList songs={flatListItems} onPress={(e, typeApi, created_by, title) => toViewSong(e, typeApi, created_by, title)}/>
                :
                <View style={styles.LoginContainer}>
                    <Text style={styles.TextInfo}>Login untuk melihat daftar favorit</Text>
                    <TouchableOpacity style={styles.Button} onPress={toLogin}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
            }
            
        </View>
    );
    
}

const styles = StyleSheet.create({
    Container : {
        flex:1,
        backgroundColor:'#fff'
    },
    LoginContainer : {
        alignItems : 'center',
        justifyContent :'center',
        padding : '5%'
    },
    TextInfo : {
        color : 'grey',
        marginTop : '5%',
        marginBottom : '5%'
    },
    Button : {
        height:'20%',
        width:'40%',
        flexDirection : 'row',
        alignItems:'center',
        justifyContent : 'center',
        backgroundColor:'#fff',
        elevation: 10,
        borderRadius: 30
    }
})