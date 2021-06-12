import { Body, Icon, ListItem, Right, Text, View } from 'native-base';
import React from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';

export default function SongList({handleLoadMore, songs, search, onPress, loading, onArtistPress}) {
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    const loadMore=()=>{
        if(search){
            handleLoadMore();
        }
    }
    const renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
         if (!loading) return null;
         return (
           <ActivityIndicator
                size={'large'}
                style={{ color: '#000' }}
           />
         );
    };
    
    return (
            songs == null ?
                <View></View>
            :
                <FlatList
                    data={songs}
                    renderItem={({ item }) => {
                        return (
                            <View>
                                {
                                    (item.title || item.judul) ?
                                    <ListItem onPress={() => onPress(item.id, item.judul ? 'chordPro' : 'localAPI', item.created_by ? item.created_by : 'api', item.title ? item.title +' '+ item.artist : item.judul +' '+ item.nama_band)}>
                                        <Body>
                                            <Text>{item.title ? toTitleCase(item.title) : item.judul}</Text>
                                            <Text note numberOfLines={1}>{item.artist ? toTitleCase(item.artist) : item.nama_band }</Text>
                                                {
                                                    item.created_by &&
                                                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                                                    <Icon type="FontAwesome" name="edit" style={{ fontSize: 10, marginHorizontal: 3 }} color='#ccc' />
                                                    <Text numberOfLines={1} style={{ fontSize: 10, color: "grey" }}>{item.created_by ? item.created_by.slice(0,item.created_by.indexOf('@')):'OpenChordAPI' }</Text>
                                                    </View>
                                                }
                                        </Body>
                                        {
                                            item.judul ?
                                                <Right style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                </Right>
                                                :
                                                <Right style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <Icon type="FontAwesome" name="heart" />
                                                    <Text style={{ color: '#ccc', paddingHorizontal: 10, fontSize: 10 }}>{item.likes ? item.likes.length : 0} suka</Text>
                                                </Right>

                                        }

                                    </ListItem>
                                    :
                                    <ListItem onPress={() => onArtistPress(item.id, item.nama)}>
                                        <Body style={{flexDirection:'row'}}>
                                            <Icon type="Ionicons" name="md-people" style={{color: '#ccc'}} />
                                            <Text numberOfLines={1}>{item.nama}</Text>
                                        </Body>
                                        <Right style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <Icon type="AntDesign" name="arrowright" />
                                        </Right>
                                    </ListItem>
                                }
                            </View>
                        )
                    }}
                    keyExtractor={songs => songs.key ? songs.key.toString() : songs.id.toString()}
                    ListFooterComponent={renderFooter}
                    onEndReachedThreshold={0.4}
                    onEndReached={() => {
                        if(loading){
                            loadMore()
                        }                                
                    }}
                />
            
    )
    
}