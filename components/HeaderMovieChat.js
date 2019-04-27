import React from 'react';
import { Image } from 'react-native-elements';
import Colors from '../constants/Colors';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default class HeaderMovieChat extends React.Component {
  render() {
    return (
      <View style={styles.header}>

      <Image style={styles.headerLogo} source={require('../assets/images/logo-white.png')} />

      <TouchableHighlight underlayColor={'transparent'} style={styles.headerMenu} onPress={this._onPressOpenMenu}>
        <Image style={styles.headerMenuImage} source={require('../assets/images/options-btn.png')} />
      </TouchableHighlight>
  
      </View>
    );
  }

  _onPressOpenMenu = () => {
    alert("Menu");
  };
}

const styles = StyleSheet.create({
  header: {
    flex: 0,
    flexDirection: 'row',
    height: 40,
    backgroundColor: Colors.customYellow,
  },
  headerLogo: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    marginLeft: 6,
    marginTop: 6,
  },
  headerMenu: {
    marginLeft: 'auto',
    marginTop: 5,
  },
  headerMenuImage: {
    height: 30,
    resizeMode: 'contain',
  },
});