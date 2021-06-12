import { Body, Icon, ListItem, Right, Text, View } from 'native-base';
import React from 'react';
import { FlatList } from 'react-native';

export default class ArtistList extends React.Component {

    render() {
        let artists = this.props.artists;
        return (
            <View>
                {
                    artists == null ?
                        <View></View> :
                        <FlatList
                            data={artists}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <ListItem onPress={() => this.props.onPress(item.id)}>
                                                <Body>
                                                    <Text numberOfLines={1}>{item.nama}</Text>
                                                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                                                        <Icon type="FontAwesome" name="person" style={{ fontSize: 13, marginHorizontal: 3 }} color='#ccc' />
                                                        <Text style={{ fontSize: 13, color: "grey" }}>Penyanyi</Text>
                                                    </View>
                                                </Body>
                                                <Right style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <Icon type="AntDesign" name="arrowright" />
                                                </Right>
                                            </ListItem>
                                    </View>
                                )
                            }}
                            keyExtractor={artists => artists.id}
                        />
                }
            </View>
        )
    }
}