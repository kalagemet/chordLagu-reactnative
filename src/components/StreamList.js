import { Body, Icon, ListItem, Left, Right, Thumbnail, Text, View} from 'native-base';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import {FlatList} from 'react-native-gesture-handler'

export default class StreamList extends React.Component {

    render() {
        let streams = this.props.streams.collection;
        return (
            <View>
                {
                    streams == null ?
                        <View></View> :
                        <FlatList
                            data={streams}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableHighlight>
                                        {
                                            item.title &&
                                            <ListItem onPress={() => this.props.onPress(item.id)}>
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
                            keyExtractor={streams => streams.id.toString()}
                        />
                }
            </View>
        )
    }
}