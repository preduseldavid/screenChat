import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, StackActions } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import MovieChatScreen from '../screens/MovieChatScreen';

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

const MainStack = createStackNavigator({
  MainTab: {
    screen: MainTabNavigator,
    navigationOptions: {
	    headerStyle: {
	    	elevation: 0,
	      backgroundColor: Colors.customYellow,
	      height: 40,
	    },
	    headerLeft:(
	      <TouchableOpacity onPress={() => StackActions.push({ routeName: 'MovieChat' })}>
	        <Image style={styles.headerLogo} source={require('../assets/images/logo-white.png')} />
	      </TouchableOpacity>
	    ),
	    headerRight: (
	      <TouchableOpacity style={{ marginRight: 6 }} onPress={this.navigateBack}>
	        <Icon
	          name='menu'
	          size={30}
	          color='white'
	        />
	      </TouchableOpacity>
	    ),
    },
  }
});

const TheOtherStack = createStackNavigator({
  MovieChat: MovieChatScreen,
});

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainStack,
  TheOther: TheOtherStack,
}));

