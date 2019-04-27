import React from 'react';
import { Image } from 'react-native-elements';
import Colors from '../constants/Colors';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
      <TouchableOpacity onPress={this._onPressLogo}>
        <Image style={styles.headerLogo} source={require('../assets/images/logo-white.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.headerMenu} onPress={this._onPressOpenMenu}>
        <Image style={styles.headerMenuImage} source={require('../assets/images/menu-white.png')} />
      </TouchableOpacity>
  
      </View>
    );
  }

  _onPressLogo = () => {
    console.log(this.props);
    this.props.navigation.navigate({ routeName: 'Search',  params: {  } })
  };

  _onPressOpenMenu = () => {
    alert("Back");
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