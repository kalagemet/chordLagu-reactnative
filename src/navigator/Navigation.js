import React from 'react';
import { Appearance } from 'react-native';
import BottomNav from './BottomNav';
import Login from '../pages/front/Login';
import Signup from '../pages/front/Signup';
import ViewSong from '../pages/ViewSong';
import About from '../pages/main/profile/settings/About';
import EditSong from '../pages/EditSong';
import MakeSong from '../pages/MakeSong';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PreferencesContext, getTheme, setTheme } from '../Settings';
import { navigationRef } from './RootNavigation';

const Stack = createStackNavigator();
const colorScheme = Appearance.getColorScheme();

function AppContainer() {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  React.useEffect(()=>{
    getTheme((value)=>{
      if(value){
        value == 'dark' ? setIsThemeDark(true) : setIsThemeDark(false)
      } else{
        colorScheme == 'dark' ? setIsThemeDark(true) : setIsThemeDark(false)
      }
    })
  },[])

  const MyDefaultTheme = {
    ...DefaultTheme,
    colors: {
      primary: '#90A4AE',
      background: '#FFF',
      card: '#E0E0E0',
      text: '#000',
      notification: '#3E50B4',
      border: '#FFFFFF'
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      primary: '#DDDDDD',
      background: '#212121',
      card: '#303030',
      text: '#FFF',
      notification: '#FF3F80',
      border: "#303030"
    },
  };

  let theme = isThemeDark ? MyDarkTheme : MyDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    setTheme(isThemeDark ? 'default' : 'dark', ()=>console.log('theme changed'))
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <NavigationContainer theme={theme} ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={BottomNav} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
          <Stack.Screen name="ViewSong" component={ViewSong} options={{headerShown: false}} />
          <Stack.Screen name="About" component={About} options={{headerShown: false}} />
          <Stack.Screen name="EditSong" component={EditSong} options={{headerShown: false}} />
          <Stack.Screen name="MakeSong" component={MakeSong} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </PreferencesContext.Provider>
  );
}

export default AppContainer;
