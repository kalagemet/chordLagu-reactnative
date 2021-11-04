import React from 'react';
import { FlatList, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function CategoryList({ data, onPress, current }) {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, alignItems:'center'}}
                data={data}
                renderItem={({ item }) => {
                    let selecetd = item === current;
                    return (
                        <TouchableOpacity
                            onPress={()=>onPress(item)}
                            style={{
                                borderRadius: 20, 
                                backgroundColor: selecetd ? colors.text : colors.card,
                                paddingVertical: 7,
                                paddingHorizontal: 20,
                                elevation:3,
                                height:'100%'
                            }}>
                            <Text 
                                style={{ 
                                    color: selecetd ? colors.background : colors.text,
                                }}>
                                    {item}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item) => item}
                horizontal={true}
                ItemSeparatorComponent={() => { return (<View style={{ width: 10 }}></View>) }}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )

}