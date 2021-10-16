import { useTheme } from '@react-navigation/native'
import React from 'react'
import {View,Image,Text, TouchableOpacity, Linking} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function About({navigation}) {
    const { colors } = useTheme();
    return(
        <View style={{flex:1, alignItems:'center'}}>
            <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', padding:'5%'}} >
                <Image source={require('../../../../assets/Images/chordlagu.png')} style={{width: 40, height: 40}} resizeMode='contain'/>
                <Text style={{marginLeft:'5%', fontSize:30, color:colors.text}}>ChordLagu</Text>
            </View>
            <Text style={{ flex:5, color:colors.text}}>Versi : v2.1.2</Text>
            <View style={{flex:2, alignItems:'center', flexDirection:'row', padding:'5%'}}>
                <TouchableOpacity 
                    style={{ width:'50%', width:'40%', padding:'3%', borderRadius:20, alignItems:'center', justifyContent:'center', elevation:10, backgroundColor:colors.background}}
                    onPress={()=>Linking.openURL('https://www.instagram.com/chordlaguofficial/')}
                >
                    <Ionicons size={40} name="logo-instagram" color={colors.text} />
                    <Text style={{color:colors.text}}>@chordlaguofficial</Text>
                </TouchableOpacity>
                <View 
                    style={{ padding:'3%', borderRadius:20, alignItems:'center', justifyContent:'center', backgroundColor:colors.background}}
                >
                    <Ionicons size={40} name="mail-outline" color={colors.text} />
                    <Text style={{color:colors.text}}>afifmuhammad5997@gmail.com</Text>
                    <Text style={{color:colors.text}}>hamoedmusafa@gmail.com</Text>
                </View>
            </View>
        </View>
    )    
}