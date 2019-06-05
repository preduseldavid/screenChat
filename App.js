/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, Fragment} from 'react';
import {Platform, StyleSheet, StatusBar, Text, View, SafeAreaView} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import Username from './screens/SettingsScreen';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { MenuProvider } from 'react-native-popup-menu';
import Colors from './constants/Colors';


 // Igonore warnings
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer', 'ViewPagerAndroid', 'Failed prop type']);

var Realtime = require("ably").Realtime;
var ablyChannels = [];

type Props = {};
export default class App extends Component<Props> {


  constructor(props) {
    super(props);
    this.state = {
      username: null,
      uniqueId: DeviceInfo.getUniqueID(),
      statusBarColor: '',
    };
    this.updateUsername = this.updateUsername.bind(this);
    this.changeStatusBarColor = this.changeStatusBarColor.bind(this);
    global.changeStatusBarColor = this.changeStatusBarColor;
  }

  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen

    global.ably = new Realtime({
      key: "TPURNw.X4pdwg:1gMMoqxLUl30a7lm",
      clientId: this.state.uniqueId
    });

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

  changeStatusBarColor = (color) => {
    this.setState({ statusBarColor: color });
  };



  render() {
    if (this.state.username != null)
      return (
        <MenuProvider>
          <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: this.state.statusBarColor }} />
            <SafeAreaView style={styles.container}>
              <AppNavigator/>
            </SafeAreaView>
          </Fragment>
        </MenuProvider>
      );
    else
      return (
          <Username noBack updateUsername={this.updateUsername}/>
      );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
