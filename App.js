/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, Fragment} from 'react';
import {Platform, StyleSheet, StatusBar, Text, View, SafeAreaView, Button} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import SettingsScreen from './screens/SettingsScreen';
import TermsOfUseScreen from './screens/TermsOfUseScreen';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { MenuProvider } from 'react-native-popup-menu';
import Colors from './constants/Colors';
import NetInfo from "@react-native-community/netinfo";
import { Dialog } from 'react-native-simple-dialogs';

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
      userAgreementAgreed: null,
      netInfoState: null,
      dialogVisible: false,
    };
    this.updateUsername = this.updateUsername.bind(this);
    this.changeStatusBarColor = this.changeStatusBarColor.bind(this);
    this.acceptTermsAndConitions = this.acceptTermsAndConitions.bind(this);
    global.changeStatusBarColor = this.changeStatusBarColor;
  }

  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen

    global.ably = new Realtime({
      key: "TPURNw.X4pdwg:1gMMoqxLUl30a7lm",
      clientId: this.state.uniqueId
    });

    AsyncStorage.multiGet(["username", "userAgreementAgreed"])
    .then(value => {
      this.setState({
        username: value[0][1],
        userAgreementAgreed: value[1][1],
      });
    })
    .done(() => {
      SplashScreen.hide();
    });

    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      this.connectionStateChange(state);
    });

  }

  connectionStateChange = (state) => {
    if (this.netInfoState != state.isConnected)
      this.setState({
        dialogVisible: !state.isConnected,
      });
  }


  updateUsername = (newUsername) => {
    AsyncStorage.setItem("username", newUsername);
    this.setState({ username: newUsername });
  };

  changeStatusBarColor = (color) => {
    this.setState({ statusBarColor: color });
  };

  acceptTermsAndConitions = () => {
    AsyncStorage.setItem("userAgreementAgreed", 'true');
    this.setState({ userAgreementAgreed: 'true' });
  }



  render() {
    if (this.state.userAgreementAgreed !== 'true') {
      return (
        <TermsOfUseScreen noBack acceptTermsAndConitions={this.acceptTermsAndConitions}/>
      );
    }
    else if (this.state.username != null) {
      return (

        <MenuProvider>
          <Dialog
            visible={this.state.dialogVisible}
            title="Info"
            titleStyle={styles.latoText}
          >
              <View>
                  <Text style={styles.latoText}>Oops.. You are not connected to the Internet, please enable the Internet on your device</Text>
              </View>
          </Dialog>
          <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: this.state.statusBarColor }} />
            <SafeAreaView style={styles.container}>
              <AppNavigator/>
            </SafeAreaView>
          </Fragment>
        </MenuProvider>
      );
    }
    else {
      return (
          <SettingsScreen noBack updateUsername={this.updateUsername}/>
      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  latoText: {
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
  },
});
