import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function InputText({name, onChangeText, secure}){
  return (
    <TextInput style={styles.Input} placeholder={name} onChangeText={(text) => {onChangeText(text)}} secureTextEntry={secure?true:false} />
  )
}

const styles = StyleSheet.create({
    Input : {
        flexDirection:'row',
        paddingHorizontal:'3%',
        marginHorizontal : '5%',
        backgroundColor:'#fff',
        marginBottom:'1%',
        height:'11%',
        elevation:5,
        width:'90%',
        justifyContent:'center',
        alignItems:'center'
    }
});

export default InputText;