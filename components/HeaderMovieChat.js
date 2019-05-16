import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {
  Image,
  Icon
} from 'react-native-elements';
import Colors from '../constants/Colors';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default class HeaderMovieChat extends React.Component {
  render() {
    return (
      <View style={styles.header}>

      <StatusBar
        backgroundColor={Colors.lightGray3}
        barStyle="dark-content"
      />

      <TouchableOpacity style={{ marginLeft: 6 }} onPress={this.props.goBack}>
        <Icon
          name='arrow-back'
          size={30}
          color={Colors.customGray}
        />
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.headerTitle}>{this.props.title}</Text>

      <Menu name={'myChat'}>
        <MenuTrigger style={{ marginRight: 6 }}>
            <Icon
              name='more-vert'
              size={30}
              color={Colors.customGray}
            />
        </MenuTrigger>

        <MenuOptions>
          <MenuOption onSelect={this.props.goToSettings} >
            <Text style={styles.chatMenuOption}>Settings</Text>
          </MenuOption>
          <MenuOption onSelect={this.props.deleteChat} >
            <Text style={styles.chatMenuOption}>Delete Chat</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>

      </View>
    );
  }

  _onPressOpenMenu = () => {
    alert("Menu");
  };
}

const styles = StyleSheet.create({
  chatMenuOption: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    paddingVertical: 10,
    fontFamily: 'Lato-Regular',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    height: 50,
    backgroundColor: Colors.lightGray3,
    paddingTop: 5,
  },
  headerTitle: {
    textAlign:"center",
    flex:1,
    color: Colors.customGray,
    fontSize: 20,
    fontFamily: 'Lato-Bold',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 3,
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
