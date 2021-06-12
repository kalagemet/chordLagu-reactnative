import React from 'react';
import BottomNav from './BottomNav';
import Login from '../pages/front/Login';
import Signup from '../pages/front/Signup';
import Loading from '../pages/front/Loading';
import ViewSong from '../pages/ViewSong';
import EditSong from '../pages/EditSong';
import MakeSong from '../pages/MakeSong';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

function AppContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={Loading} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={BottomNav} options={{headerShown: false, headerTitle:'ChordLagu'}}/>
        <Stack.Screen name="ViewSong" component={ViewSong} />
        <Stack.Screen name="EditSong" component={EditSong} />
        <Stack.Screen name="MakeSong" component={MakeSong} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
