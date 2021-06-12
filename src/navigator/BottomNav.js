import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import EditSong from '../pages/EditSong';
import Favourites from '../pages/main/Favourites';
import Home from '../pages/main/Home';
import MakeSong from '../pages/MakeSong';
import MyChords from '../pages/main/profile/MyChords';
import Profile from '../pages/main/profile/Profile';
import Search from '../pages/main/search/Search';
import Tools from '../pages/main/tools/Tools';
import ViewSong from '../pages/ViewSong';
import SongsByArtistList from '../pages/main/search/SongsByArtistList';

const Tab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const SearchStack = createStackNavigator()
const FavouritesStack = createStackNavigator()
const ProfileStack = createStackNavigator()


function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{
      headerShown: false
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
      headerShown: false
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
      headerShown: false
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
      headerShown: false
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
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Favourites" component={FavouritesStackScreen} />
        <Tab.Screen name="Search" component={SearchStackScreen} />
        <Tab.Screen name="Tools" component={Tools} options={{headerShown:false}}/>
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  )
}