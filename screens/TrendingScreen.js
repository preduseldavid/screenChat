
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Button,
  FlatList,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from '../constants/Colors';
import { ListItem } from 'react-native-elements';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import ActionSheet from 'react-native-actionsheet';
import { ConfirmDialog } from 'react-native-simple-dialogs';

export default class TrendingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      uniqueId: DeviceInfo.getUniqueID(),
      trendingList: [],
      update: true,
    };

    this.navFocusListener = null;
    this.navBlurListener = null;
  };

  componentDidMount = () => {
    this.navFocusListener = this.props.navigation.addListener(
      'didFocus',
          payload => {
            global.changeStatusBarColor(Colors.customYellow);
        }
    );


    this.navBlurListener = this.props.navigation.addListener(
      'didBlur',
          payload => {
            //this.unsubscribeFromAll();
          }
    );

    this.retrieveTrendingList();
  };

  keyExtractor = (item, index) => index.toString();

  goToChatItem = (item) => {
    item.hasNewMessages = false;
    this.props.navigation.navigate({ routeName: 'MovieChat',  params: { movie: item } })
  };

  renderItem = ({ item }) => {
    if (item.title)
      item.media_type = 'movie';
    else
      item.media_type = 'tv';

    return (
      <TouchableHighlight onPress={() => this.goToChatItem(item)} onLongPress={() => this.onLongPress(item)}>
        <ListItem
          containerStyle={styles.listItem}
          title={item.media_type == 'movie' ? item.title : item.name}
          titleStyle={styles.listTitle}
          subtitle={item.media_type == 'person' ? 'Person' : (item.media_type == 'movie' ? 'Movie' : 'Tv Show')}
          rightSubtitle={item.hasNewMessages ? 'NEW MESSAGES' : ''}
          subtitleStyle={styles.listSubtitle}
          rightSubtitleStyle={styles.listSubtitle}
          leftIcon={{ name: item.media_type }}
          pad={8}
        />
      </TouchableHighlight>
    );
  };

  retrieveTrendingList = () => {
    var url = 'https://api.themoviedb.org/3/trending/all/day?api_key=1922557a7287f1dd113f0ff672f93dcd&language=en-US&';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          //isLoading: false,
          trendingList: responseJson.results,
        }, function(){
          console.log(responseJson);
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps='handled'
          keyExtractor={this.keyExtractor}
          data={this.state.trendingList}
          extraData={this.state}
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
    paddingLeft: '3%',
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
