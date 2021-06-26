import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import {FlatList} from 'react-native-gesture-handler'
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text, View } from 'react-native';

export default function StreamList({streams, onPress}) {
    const { colors } = useTheme();
    let stream = streams.collection;
    return (
        <View>
            {
                streams.total_results == 0 ?
                    <Text style={{alignSelf:'center', marginTop:'10%'}}>Audio Tidak Tersedia</Text> :
                    <FlatList
                        data={stream}
                        renderItem={({ item }) => {
                            return (
                                item.title &&
                                <TouchableOpacity style={{flexDirection:'row', paddingHorizontal:'4%', paddingVertical:'1%'}} onPress={() => onPress(item.id)}>
                                    <Image resizeMode='stretch' style={{flex:1}} source={{ uri: item.artwork_url ? item.artwork_url : item.user.avatar_url }} />
                                    <View style={{flexDirection:'row', flex:4, paddingVertical:'3%'}}>
                                        <View style={{marginLeft:10, justifyContent:'center', width:'80%'}}>
                                            <Text style={{color:colors.text}} numberOfLines={1}>{item.title}</Text>
                                            <Text style={{color:colors.text}} numberOfLines={1}>{item.user.username}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1, alignItems:'flex-end'}}>
                                        <Ionicons style={{color:colors.text}} size={30} name="arrow-forward"/>
                                    </View>
                                </TouchableOpacity>    
                            )
                        }}
                        keyExtractor={stream => stream.id.toString()}
                    />
            }
        </View>
    )
    
}