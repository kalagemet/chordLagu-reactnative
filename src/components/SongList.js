import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';

export default function SongList({handleLoadMore, songs, search, onPress, loading, onArtistPress, refreshing, onRefresh}) {
    const { colors } = useTheme();

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
                style={{marginVertical:'3%'}}
                size='small'
                color='#000'
           />
         );
    };
    
    return (
        songs == null ?
            <View></View>
        :
            <FlatList
                refreshing={refreshing?refreshing:false}
                onRefresh={() => onRefresh && onRefresh()}
                data={songs}
                renderItem={({ item }) => {
                    return (
                        <View>
                            {
                                (item.title || item.judul) ? //List lagu
                                <TouchableOpacity style={styles.item} onPress={() => onPress(item.id, item.created_by, item.judul +' '+ item.nama_band)}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:colors.text}}>{item.title ? toTitleCase(item.title) : item.judul}</Text>
                                        <Text style={{color:colors.primary}} numberOfLines={1}>{item.artist ? toTitleCase(item.artist) : item.nama_band }</Text>
                                    </View>
                                </TouchableOpacity>
                                : //list band
                                <TouchableOpacity style={styles.item} onPress={() => onArtistPress(item.id, item.nama)}>
                                    <View style={{flex:4, flexDirection:'row', alignItems:'center'}}>
                                        <Ionicons name="people" size={30} style={{color: '#ccc', marginRight:'5%'}} />
                                        <Text numberOfLines={1} style={{color:colors.text}}>{item.nama}</Text>
                                    </View>
                                    <View style={{flex:1, alignItems:'flex-end'}}>
                                        <Ionicons size={30} color='#ccc' name="arrow-forward" />
                                    </View>
                                    
                                </TouchableOpacity>
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

const styles = StyleSheet.create({
    item : {
        flexDirection : 'row',
        paddingHorizontal : '5%',
        paddingVertical : '3%'
    }
})