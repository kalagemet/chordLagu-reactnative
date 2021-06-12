import React from 'react';
import {View, Text} from 'react-native';
import Swiper from 'react-native-swiper'
import ViewChord from '../components/ViewChord';

const ChordSwiper = props => {

  const {
    selectedChord,
    name
  } = props;

  console.log(name)
  return (
    <Swiper>
    {
        selectedChord ?
        selectedChord.map((data, index) => {
        return (
            <View style={{flex:1, alignItems:'center'}} key={index} >
                <View style={{marginRight:20}}>
                    <ViewChord 
                        chord={data.positions}
                        width={200}
                        height={400}
                    />
                </View>
                <Text style={{fontSize:20, marginTop:10}}>{name}</Text>
            </View>
        )
        })
        :
        <View></View>
    }
    </Swiper>
  )
}

export default ChordSwiper;