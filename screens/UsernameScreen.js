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


var Realtime = require("ably").Realtime;
var ably, channel;
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
  }

  render() {

    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.txtInput}
          style={styles.usernameInput}
          placeholder="Enter Your Username"
          onChangeText={txtInput => this.setState({ txtInput })}
        />

        <Button
          style={styles.submitBtn}
          onPress={() => this.props.updateUsername(this.state.txtInput)}
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