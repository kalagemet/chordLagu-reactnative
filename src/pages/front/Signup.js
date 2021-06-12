import { Button, Container, Form, Input, Item, Text, View } from 'native-base'
import React, {useState} from 'react'
import { StyleSheet } from 'react-native'
import auth from '@react-native-firebase/auth';

export default function Signup ({navigation}) {

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
        .then(() => navigation.navigate('Home'))
        .catch(error => setErrorMessage(error.message))
    }
  }

  return (
      <Container>
        <View style={styles.HeaderContainer}>
          <Text style={styles.TextA}>Daftar</Text>
        </View>
        <View style={styles.FormContainer}>
          {errorMessage &&
            <Text style={{ color: 'red', textAlign:'center', padding:10}}>
              {errorMessage}
            </Text>}
            <Form>
              <Item regular>
                <Input
                  placeholder="Email"
                  autoCapitalize="none"
                  onChangeText={email => setEmail(email)}
                />
              </Item>
              <Item regular>
                <Input
                  secureTextEntry
                  placeholder="Password"
                  autoCapitalize="none"
                  onChangeText={password => setPassword(password)}
                />
              </Item>
              <Item regular>
                <Input
                  secureTextEntry
                  placeholder="Ulangi Password"
                  autoCapitalize="none"
                  onChangeText={passwordVerify => setPasswordVerify(passwordVerify)}
                />
              </Item>
            </Form>
            <View style={styles.ButtonContainer}>
              <Button primary onPress={handleSignUp} style={styles.Button}>
                <Text>Daftar</Text>
              </Button>
            </View>
            <View style={styles.ButtonContainer}>
              <Button bordered
                onPress={() => navigation.navigate('Login')}
                style={styles.Button}
              >
                <Text>Sudah Punya Akun? Login</Text>
              </Button>
            </View>
            
        </View>
      </Container>
  )
  
}

const styles = StyleSheet.create({
  HeaderContainer : {
      flex : 2,
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