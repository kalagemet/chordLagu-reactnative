import React from 'react';
import {View, Text} from 'react-native';
import Swiper from 'react-native-swiper'
import ViewChord from '../components/ViewChord';
import { useTheme } from '@react-navigation/native';

const ChordSwiper = props => {
  const { colors } = useTheme();
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
                        height={350}
                        color={colors.text}
                    />
                </View>
                <Text style={{fontSize:20, marginTop:10, color:colors.text}}>{name}</Text>
            </View>
        )
        })
        :
        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
          <Text style={{color:colors.text}}>Tidak Ditemukan {name}</Text>
        </View>
    }
    </Swiper>
  )
}

export default ChordSwiper;