import { Body, Container, Header, Left, Right, Title, Button, View, Text } from 'native-base';
import { StyleSheet, TouchableOpacity} from 'react-native';
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
        <Container>
        
        <Header>
            <Left>
            <Title>Favorit</Title>
            </Left>
            <Body>
            
            </Body>
            <Right />
        </Header>

        <View>
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
        </Container>
    );
    
}

const styles = StyleSheet.create({
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
        height:'30%',
        width:'30%',
        flexDirection : 'row',
        alignItems:'center',
        justifyContent : 'center',
        backgroundColor:'#ccc'
    }
})