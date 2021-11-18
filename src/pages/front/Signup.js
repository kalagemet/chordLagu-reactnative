import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import Button from '../../components/Button';
import InputText from '../../components/InputText';
import { useTheme } from '@react-navigation/native';

export default function Signup ({navigation}) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [passwordVerify, setPasswordVerify] = useState('')


  const handleSignUp = () => {
    if(email=='' || password==''){
      setErrorMessage('Email dan password tidak boleh kosong')
    } else if(password != passwordVerify){
      setErrorMessage('Password tidak cocok')
    }else{
        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => navigation.navigate('Main'))
        .catch(error => setErrorMessage(error.message))
    }
  }

  return (
      <View style={{flex:1}}>
        <View style={styles.HeaderContainer}>
          <Text style={{...styles.TextA, color: colors.text}}>Daftar</Text>
        </View>
        <View style={styles.FormContainer}>
          {errorMessage &&
            <Text style={{ color: colors.notification, textAlign:'center', padding:10}}>
              {errorMessage}
            </Text>}
            <InputText name='Email' onChangeText={(text) => setEmail(text)}/>
            <InputText secure name='Password' onChangeText={(text) => setPassword(text)} />
            <InputText secure name='Ulangi Password' onChangeText={(text) => setPasswordVerify(text)} />

            <View style={{margin:'3%'}}/>

            <Button name='Daftar' onPress={handleSignUp} height='11%'/>
            <Button name='Sudah Punya Akun? Login' onPress={() => navigation.pop()} height='11%'/>
            
        </View>
      </View>
  )
  
}

const styles = StyleSheet.create({
  HeaderContainer : {
      flex : 1,
      justifyContent : 'center',
      alignItems : 'center',
      width : '100%',
      height : '100%'
  },
  FormContainer : {
      flex : 2,
      width : '100%',
      height : '100%',
      padding : 20
  },
  Button : {
      justifyContent : 'center',
  },
  ButtonContainer : {
    paddingTop : 10
  },
  TextA : {
      fontSize : 28,
      textAlign : "center",
      padding : 20
  }
})