import React, {useState} from 'react';
import BottomNav from './BottomNav';
import Login from '../pages/front/Login';
import Signup from '../pages/front/Signup';
import Loading from '../pages/front/Loading';
import ViewSong from '../pages/ViewSong';
import EditSong from '../pages/EditSong';
import MakeSong from '../pages/MakeSong';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PreferencesContext } from '../Settings';

const Stack = createStackNavigator();

function AppContainer() {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  let theme = isThemeDark ? DarkTheme : DefaultTheme;

  const toggleTheme = React.useCallback(() => {
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
