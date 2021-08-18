import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';

function Button({name, icon, onPress, width, height, disabled}){
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={{...styles.Button, backgroundColor: colors.card, width:width, height:height, opacity: disabled ? 0.3 : 1}} 
      onPress={()=>onPress()} 
      disabled={disabled}
    >
        {icon && <Ionicons name={icon} style={{...styles.Icon, color:colors.text}}/>}
        <Text style={{color:colors.text}}>{name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    Button : {
        flexDirection:'row',
        paddingHorizontal:'3%',
        marginVertical:'2%',
        borderRadius : 20,
        elevation : 5,
        justifyContent:'center',
        alignItems:'center'
    },
    Icon : {
        marginHorizontal:'3%',
        fontSize: 25
    }
});

export default Button;