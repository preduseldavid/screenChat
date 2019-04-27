import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  TouchableHighlight
} from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {searchText: ''};
    this.searchTextInput = null;
    this.searchClearBtn = null;
  }

  render() {
    return (
        <View style={styles.searchBar}>
          <TextInput
            inlineImageLeft='search_icon'
            ref={input => { this.searchTextInput = input }}
            clearButtonMode="always"
            style={styles.searchInput}
            placeholder="Search Movie by Name..."
            onChangeText={this._onSearchKeyDown}
            onSubmitEditing={this._onPressSearchSend}
            returnKeyType="search"
          />
        </View>
    );
  }

  _onSearchKeyDown = (searchText) => {
    this.setState({searchText});
    if (searchText != '') {
      // show the clear icon
    }
    else {
      // hide the clear icon
    }
    console.log(searchText);
  };

  _onPressSearchSend = () => {
    alert("Search");
  };

  _onPressClearBtn = () => {
    this.searchTextInput.clear();
    console.log(this.searchClearBtn);
    this.searchClearBtn.state.show = false;
  };

}

const styles = StyleSheet.create({
  searchBar: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  searchIcon: {
    marginTop: 100,
  },
  searchInput: {
    fontFamily: 'Lato-Regular',
    width: '80%',
    height: 40, 
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.customYellow,
    marginTop: 10,
  },
  clearBtn: {
    width: 40,
    height: 40,
    marginTop: 10,
    marginLeft: -40,
  },
  clearBtnImage: {
    resizeMode: 'contain',
    width: 40,
    height: 40,
    opacity: 0.2,
  },
  searchBtn: {
    width: 40,
    height: 40,
    marginTop: 10,
    marginLeft: 10,
  },
  searchBtnImage: {
    resizeMode: 'contain',
    width: 40,
    height: 40,
  },
});
