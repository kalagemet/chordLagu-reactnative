import React from 'react';
import { FlatList, View, Dimensions} from 'react-native';
import Button from '../components/Button';

export default function CategoryList({data, onPress, current}) {
    
    return (
        <View style={{flex:1}}>
        <FlatList
            contentContainerStyle={{paddingLeft:20, paddingRight:20}}
            data={data}
            renderItem={({ item }) => {
                return (
                    <Button name={item} width={100} onPress={() => onPress(item)} disabled={current == item ? true : false} />
                )
            }}
            keyExtractor={(item) => item}
            horizontal={true}
            ItemSeparatorComponent={()=>{return(<View style={{width:10}}></View>)}}
            showsHorizontalScrollIndicator={false}
        />
        </View>
    )
    
}