import React from 'react';
import {Alert} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Favourites from '../pages/main/Favourites';
import Home from '../pages/main/Home';
import MyChords from '../pages/main/profile/MyChords';
import Profile from '../pages/main/profile/Profile';
import Search from '../pages/main/search/Search';
import Tools from '../pages/main/tools/Tools';
import Tuner from '../pages/main/tools/Tuner';
import ChordLibrary from '../pages/main/tools/ChordLibrary';
import SongsByArtistList from '../pages/main/search/SongsByArtistList';
import Setting from '../pages/main/profile/settings/Setting';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PreferencesContext } from '../Settings';

const Tab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const FavouritesStack = createStackNavigator()
const ToolsStack = createStackNavigator()
const ProfileStack = createStackNavigator()


function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
      />
      <HomeStack.Screen
        name="Search"
        component={Search}
      />
      <HomeStack.Screen
        name="SongsByArtistList"
        component={SongsByArtistList}
      />
    </HomeStack.Navigator>
  );
}

function FavouritesStackScreen() {
  const { isThemeDark } = React.useContext(PreferencesContext);
  return (
    <FavouritesStack.Navigator screenOptions={{
      headerTitle:'Favorit'
    }}>
      <FavouritesStack.Screen
        name="Favourites"
        component={Favourites}
      />
    </FavouritesStack.Navigator>
  );
}

function ToolsStackScreen() {
  return (
    <ToolsStack.Navigator screenOptions={{
      headerTitle:'Alat',
    }}>
      <ToolsStack.Screen
        name="Tools"
        component={Tools}
      />
      <ToolsStack.Screen
        name="Tuner"
        component={Tuner}
      />
      <ToolsStack.Screen
        name="ChordLibrary"
        component={ChordLibrary}
      />
    </ToolsStack.Navigator>
  );
}

function ProfileStackScreen() {
  const { isThemeDark } = React.useContext(PreferencesContext);
  return (
    <ProfileStack.Navigator screenOptions={({route, navigation}) => ({
      headerTitle: route.name != 'Setting' ? 'Profil' : 'Settings',
      headerRightContainerStyle:{flex:1, paddingHorizontal:'5%', width:'50%'},
      headerRight: () => (
        route.name != 'Setting' &&
        <Ionicons
          size={25}
          name="settings-outline"
          onPress={() => navigation.navigate('Setting') }
          color={isThemeDark ? '#FFF' : '#000'}
        />
      ),
    })}>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
      />
      <ProfileStack.Screen
        name="MyChords"
        component={MyChords}
      />
      <ProfileStack.Screen
        name="Setting"
        component={Setting}
      />
    </ProfileStack.Navigator>
  );
}

export default function BottomNav(){
  const { isThemeDark } = React.useContext(PreferencesContext);
  return(
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar:true, 
        activeTintColor:'#000', 
        showLabel:false
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if(route.name == "Home") {
            iconName = focused
            ? 'home'
            : 'home-outline'
          } else if (route.name == "Favourites") {
            iconName = focused
            ? 'heart'
            : 'heart-outline'
          } else if (route.name == "Tools") {
            iconName = focused
            ? 'build'
            : 'build-outline'
          }else if (route.name == "Profile") {
            iconName = focused
            ? 'person'
            : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={isThemeDark ? '#FFF' : '#000'} />;
        }
      })}
    >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Favourites" component={FavouritesStackScreen} />
        <Tab.Screen name="Tools" component={ToolsStackScreen}/>
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  )
}