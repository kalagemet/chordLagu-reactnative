import React from 'react';
import BottomNav from './BottomNav';
import Login from '../pages/front/Login';
import Signup from '../pages/front/Signup';
import Loading from '../pages/front/Loading';
import ViewSong from '../pages/ViewSong';
import EditSong from '../pages/EditSong';
import MakeSong from '../pages/MakeSong';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PreferencesContext, getTheme, setTheme } from '../Settings';

const Stack = createStackNavigator();

function AppContainer() {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  React.useEffect(()=>{
    getTheme((value)=>{
      value == 'dark' ? setIsThemeDark(true) : setIsThemeDark(false)
    })
  },[])

  const MyDefaultTheme = {
    ...DefaultTheme,
    colors: {
      primary: '#30475E',
      background: '#FFF',
      card: '#FFF',
      text: '#000',
      notification: 'blue'
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      primary: '#DDDDDD',
      background: '#393E46',
      card: '#222831',
      text: '#FFF',
      notification: '#F05454'
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
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen name="Loading" component={Loading} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={BottomNav} options={{headerShown: false}}/>
          <Stack.Screen name="ViewSong" component={ViewSong} options={{headerShown: false}} />
          <Stack.Screen name="EditSong" component={EditSong} />
          <Stack.Screen name="MakeSong" component={MakeSong} />
        </Stack.Navigator>
      </NavigationContainer>
    </PreferencesContext.Provider>
  );
}

export default AppContainer;
