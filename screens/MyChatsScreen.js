
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
  FlatList
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from '../constants/Colors';
import { ListItem } from 'react-native-elements';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AsyncStorage from '@react-native-community/async-storage';

export default class MyChatsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { 
      searchText: '',
      myChatsList: [],
    };
  };

  componentDidMount = () => {
    this._retrieveData();
  };

  keyExtractor = (item, index) => index.toString();

  _goToChatItem = (item) => {
    this.props.navigation.navigate({ routeName: 'MovieChat',  params: { movie: item } })
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this._goToChatItem(item)}>
      <ListItem
        containerStyle={styles.listItem}
        title={item.media_type == 'movie' ? item.title : item.name}
        titleStyle={styles.listTitle}
        subtitle={item.media_type == 'person' ? 'Person' : (item.media_type == 'movie' ? 'Movie' : 'Tv Show')}
        subtitleStyle={styles.listSubtitle}
        leftIcon={{ name: item.media_type }}
        pad={8}
      />
    </TouchableOpacity>
  );

  _retrieveData = async () => {
    try {
      var list = await AsyncStorage.getItem('myChatsList');
      if (list != null)
        list = JSON.parse(list);
      else 
        list = [];

      console.log(list);

      this.setState({myChatsList: list.reverse()});
      console.log(this.state);
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps='handled'
          keyExtractor={this.keyExtractor}
          data={this.state.myChatsList}
          extraData={this.state.myChatsList}
          renderItem={this.renderItem}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    paddingLeft: '1%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray3,
  },
  listTitle: {
    color: Colors.customGray,
    fontFamily: 'Lato-Regular',
  },
  listSubtitle: {
    fontSize: 12,
    color: Colors.customYellow,
    fontFamily: 'Lato-Regular',
  },
});
