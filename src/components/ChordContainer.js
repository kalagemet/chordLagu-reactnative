import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function ChordContainer({ webView, songs, onPress}) {
    const { colors } = useTheme();
    
    return (
        songs == null ?
            <View></View>
        :
            <FlatList
                ListHeaderComponent={webView}
                data={songs}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.item} onPress={() => onPress(item.id)}>
                            <View style={{flex:4}}>
                                <Text style={{color:colors.text}}>{item.judul}</Text>
                                <Text style={{color:colors.primary}} numberOfLines={1}>{item.nama_band }</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={songs => songs.id.toString()}
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