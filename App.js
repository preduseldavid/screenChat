/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Header from './components/Header';
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import Username from './screens/UsernameScreen';
import AsyncStorage from '@react-native-community/async-storage';


 // Igonore warnings
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


type Props = {};
export default class App extends Component<Props> {


  constructor(props) {
    super(props);
    this.state = {
      username: null,
    };
    this.updateUsername = this.updateUsername.bind(this);
  }

  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen

    AsyncStorage.getItem("username")
    .then(value => {
      this.setState({ username: value });
    })
    .done(() => {
      SplashScreen.hide();
    });

    
  }



  updateUsername = (newUsername) => {
    console.log(newUsername);
    AsyncStorage.setItem("username", newUsername);
    this.setState({ username: newUsername });
  };



  render() {
    if (this.state.username != null)
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator/>
        </View>
      );
    else 
      return (
          <Username updateUsername={this.updateUsername}/>
      );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});