import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import TabBarIcon from '../components/TabBarIcon';
import SearchScreen from '../screens/SearchScreen';
import MyChatsScreen from '../screens/MyChatsScreen';

import Colors from '../constants/Colors';

const SearchStack = createStackNavigator({
  Search: SearchScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'SEARCH',
};

const MyChatsStack = createStackNavigator({
  MyChats: MyChatsScreen,
});

MyChatsStack.navigationOptions = {
  tabBarLabel: 'My CHATS',
};

const tabBarOptions = {
  tabBarOptions: {
    upperCaseLabel: false,
    pressColor: 'gray',
    style: {
      backgroundColor: 'white',
      elevation: 1,
    },
    activeTintColor: Colors.customYellow,
    inactiveTintColor: Colors.customGray,
    pressColor: Colors.customGray,
    indicatorStyle: {
      backgroundColor: Colors.customYellow,
    },
    labelStyle: {
      fontFamily: 'Lato-Bold',
      fontSize: 16,
    },
    tabStyle: {
      height: 40,
    },
  }
};

export default createMaterialTopTabNavigator({
  SearchStack,
  MyChatsStack,
}, tabBarOptions);
