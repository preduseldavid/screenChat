import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, StackActions } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import MovieChatScreen from '../screens/MovieChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

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

const SettingsStack = createStackNavigator({
  Username: SettingsScreen,
});

const MovieChatStack = createStackNavigator({
  MovieChat: MovieChatScreen
});

const TermsOfUseStack = createStackNavigator({
  TermsOfUse: TermsOfUseScreen
});

const PrivacyPolicyStack = createStackNavigator({
  PrivacyPolicy: PrivacyPolicyScreen
});

const MainStack = createStackNavigator({
  MainTab: {
    screen: MainTabNavigator,
    navigationOptions: {
	    header: null,
    },
  },
  MovieChatStack,
  SettingsStack,
  TermsOfUseStack,
  PrivacyPolicyStack,
},
{
    headerMode: 'none',
});

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainStack,
}));
