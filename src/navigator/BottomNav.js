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
import SongsByArtistList from '../pages/main/search/SongsByArtistList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PreferencesContext } from '../Settings';

const Tab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const SearchStack = createStackNavigator()
const FavouritesStack = createStackNavigator()
const ProfileStack = createStackNavigator()


function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{
      headerTitle : 'Beranda'
    }}>
      <HomeStack.Screen
        name="Home"
        component={Home}
      />
    </HomeStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={{
      headerTitle : 'Cari'
    }}>
      <SearchStack.Screen
        name="Search"
        component={Search}
      />
      <SearchStack.Screen
        name="SongsByArtistList"
        component={SongsByArtistList}
      />
    </SearchStack.Navigator>
  );
}

function FavouritesStackScreen() {
  return (
    <FavouritesStack.Navigator screenOptions={{
      headerTitle:'Favorit',
      headerRightContainerStyle:{flex:1, paddingHorizontal:'5%', width:'50%'},
      headerRight: () => (
        <Ionicons
          size={30}
          name="information-circle-outline"
          onPress={() => Alert.alert('Favorit',  'Chord favorit dapat diakses secara offline')}
          color="#000"
        />
      ),
    }}>
      <SearchStack.Screen
        name="Favourites"
        component={Favourites}
      />
    </FavouritesStack.Navigator>
  );
}

function ProfileStackScreen() {
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

  return (
    <ProfileStack.Navigator screenOptions={{
      headerTitle: 'Profil',
      headerRight: () => (
        <Ionicons
          size={30}
          name={isThemeDark ? 'moon' : 'sunny'}
          onPress={() => toggleTheme()}
          color={isThemeDark ? '#fff' : '#000'}
        />
      )
    }}>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
      />
      <ProfileStack.Screen
        name="MyChords"
        component={MyChords}
      />
    </ProfileStack.Navigator>
  );
}

export default function BottomNav(){
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
          } else if (route.name == "Search") {
            iconName = focused
            ? 'search'
            : 'search-outline'
          } else if (route.name == "Tools") {
            iconName = focused
            ? 'build'
            : 'build-outline'
          }else if (route.name == "Profile") {
            iconName = focused
            ? 'person'
            : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Favourites" component={FavouritesStackScreen} />
        <Tab.Screen name="Search" component={SearchStackScreen} />
        <Tab.Screen name="Tools" component={Tools}/>
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  )
}