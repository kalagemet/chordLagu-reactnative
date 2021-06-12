import { Body, Icon, ListItem, Left, Right, Thumbnail, Text, View} from 'native-base';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import {FlatList} from 'react-native-gesture-handler'

export default function StreamList({streams, onPress}) {
    let stream = streams.collection;
    return (
        <View>
            {
                stream == null ?
                    <View></View> :
                    <FlatList
                        data={stream}
                        renderItem={({ item }) => {
                            return (
                                <TouchableHighlight>
                                    {
                                        item.title &&
                                        <ListItem onPress={() => onPress(item.id)}>
                                            <Left>
                                                <View style={{flexDirection:'row'}}>
                                                    <Thumbnail square source={{ uri: item.artwork_url ? item.artwork_url : item.user.avatar_url }} />
                                                    <View style={{marginLeft:10, justifyContent:'center', width:'80%'}}>
                                                        <Text numberOfLines={1}>{item.title}</Text>
                                                        <Text note numberOfLines={1}>{item.user.username}</Text>
                                                    </View>
                                                </View>                      
                                            </Left>
                                            <Right>
                                            <Icon style={{color:'#000'}} type="AntDesign" size={3} name="arrowright"/>
                                            </Right>
                                        </ListItem>
                                    }
                                </TouchableHighlight>
                            )
                        }}
                        keyExtractor={stream => stream.id.toString()}
                    />
            }
        </View>
    )
    
}