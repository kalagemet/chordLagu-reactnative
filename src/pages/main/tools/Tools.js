import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import ChordLibrary from './ChordLibrary';
import Tuner from './Tuner';

export default function Tools({navigation}) {
  const { colors } = useTheme();

  return (
    <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly', paddingTop:'30%'}}>
      <TouchableOpacity 
        style={{height:'20%', width:'40%', borderRadius:20, elevation:10, alignItems:'center', padding:'3%', backgroundColor:colors.background}}
        onPress={()=>navigation.navigate("Tuner")}
      >
        <Ionicons
          size={50}
          name="speedometer-outline"
          color={colors.primary}
        />
        <Text style={{color:colors.primary}}>Tuner</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{height:'20%', width:'40%', borderRadius:20, elevation:10, alignItems:'center', padding:'3%', backgroundColor:colors.background}}
        onPress={()=>navigation.navigate("ChordLibrary")}  
      >
        <Ionicons
          size={50}
          name="library-outline"
          color={colors.primary}
        />
        <Text style={{color:colors.primary}}>Daftar Kunci</Text>
      </TouchableOpacity>
    </View>
  );
}