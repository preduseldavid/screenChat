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


var channel;
var MovieChatScreenGlobal;

export default class MovieChatScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      txtInput: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("username")
    .then(value => {
      this.setState({ username: value, txtInput: value });
    })
    .done();
  }

  updateUsername = (newUsername) => {
    if (newUsername == '')
      return;

    console.log(newUsername);
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
    var backButton;

    if (usernameRequired)
      backButton = <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => this.props.navigation.goBack(null)}>
          <Icon
            name='arrow-back'
            size={30}
            color={Colors.customYellow}
          />
        </TouchableOpacity>;

    return (
      <View style={styles.container}>
        {backButton}
        <TextInput
          value={this.state.txtInput}
          style={styles.usernameInput}
          placeholder="Enter Your Username"
          onChangeText={txtInput => this.setState({ txtInput })}
        />

        <Button
          style={styles.submitBtn}
          onPress={() => this.updateUsername(this.state.txtInput)}
          title="NEXT"
          color={Colors.customYellow}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  usernameInput: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    width: '50%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.customYellow
  },
  submitBtn: {
    width: '50',
    paddingTop: 100,
  },
});
