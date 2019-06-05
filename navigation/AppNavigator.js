import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, StackActions } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import MovieChatScreen from '../screens/MovieChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

import Colors from '../constants/Colors';
import { Icon, Image } from 'react-native-elements';
import { TouchableOpacity, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  headerLogo: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    marginLeft: 6,
    marginTop: 0,
  },
});

const UsernameStack = createStackNavigator({
  Username: SettingsScreen,
});

const MovieChatStack = createStackNavigator({
  MovieChat: MovieChatScreen
});

const MainStack = createStackNavigator({
  MainTab: {
    screen: MainTabNavigator,
    navigationOptions: {
	    header: null,
    },
  },
  MovieChatStack,
  UsernameStack,
},
{
    headerMode: 'none',
});

console.log(this.props);

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainStack,
}));
