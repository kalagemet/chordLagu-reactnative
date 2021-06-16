import React from 'react';
import {
  StyleSheet,
  TextInput
} from 'react-native';
import { useTheme } from '@react-navigation/native';

function InputText({name, onChangeText, secure}){
  const { colors } = useTheme();

  return (
    <TextInput placeholderTextColor={colors.text} style={{...styles.Input, backgroundColor:colors.card, color:colors.text}} placeholder={name} onChangeText={(text) => {onChangeText(text)}} secureTextEntry={secure?true:false} />
  )
}

const styles = StyleSheet.create({
    Input : {
        flexDirection:'row',
        paddingHorizontal:'3%',
        marginHorizontal : '5%',
        marginBottom:'1%',
        height:'11%',
        elevation:5,
        width:'90%',
        justifyContent:'center',
        alignItems:'center'
    }
});

export default InputText;