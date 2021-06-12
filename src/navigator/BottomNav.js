import React from 'react';
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
      headerTitle:'Favorit'
    }}>
      <SearchStack.Screen
        name="Favourites"
        component={Favourites}
      />
    </FavouritesStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{
      headerTitle: 'Profil'
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
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Favourites" component={FavouritesStackScreen} />
        <Tab.Screen name="Search" component={SearchStackScreen} />
        <Tab.Screen name="Tools" component={Tools}/>
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  )
}