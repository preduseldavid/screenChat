import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  ImageBackground,
} from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import Header from '../components/HeaderCustom';


var channel;
var MovieChatScreenGlobal;

export default class SettingsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      txtInput: '',
    };

    this.goBack = this.goBack.bind(this);
    this.navFocusListener = null;
  }

  componentDidMount() {
    // When we enter the screen
    if (this.props.navigation) {
      this.navFocusListener = this.props.navigation.addListener(
        'didFocus',
          payload => {
            global.changeStatusBarColor(Colors.customYellow);
          }
      );
    }
    else
      global.changeStatusBarColor(Colors.customYellow);

    AsyncStorage.getItem("username")
    .then(value => {
      this.setState({ username: value, txtInput: value });
    })
    .done();
  }

  goBack() {
    this.props.navigation.goBack(null);
  }

  updateUsername = (newUsername) => {
    if (newUsername == '')
      return;

    AsyncStorage.setItem("username", newUsername);
    this.setState({ username: newUsername });
    if (this.props.navigation) {
      this.props.navigation.state.params.callbackSuccess(newUsername);
      redirectSuccess = this.props.navigation.state.params.redirectSuccess;
      this.props.navigation.navigate({ routeName: redirectSuccess});
    }
    else
      this.props.updateUsername(newUsername);
  };

  render() {

    var usernameRequired = this.props.noBack == null;
    var header;
    if (usernameRequired)
      header =
      <Header
        title={'Settings'}
        goBack={this.goBack}
      />;

    return (
      <ScrollView style={styles.container}>
        {header}
        <Text style={styles.label}>USERNAME</Text>
        <TextInput
          value={this.state.txtInput}
          style={styles.usernameInput}
          placeholder="Enter Your Username"
          onChangeText={txtInput => this.setState({ txtInput })}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => this.updateUsername(this.state.txtInput)}
        >
          <Text style={styles.submitBtnText}>DONE</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  usernameInput: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    width: '80%',
    height: 45,
    textAlign: 'center',
    marginTop: '3%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.customYellow
  },
  submitBtn: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    marginTop: '3%',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Lato-Regular',
    backgroundColor: Colors.customYellow,
  },
  submitBtnText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Lato-Bold',
    marginTop: '10%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
