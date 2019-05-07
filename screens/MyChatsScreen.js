
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
import DeviceInfo from 'react-native-device-info';

var channel;

export default class MyChatsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { 
      uniqueId: DeviceInfo.getUniqueID(),
      myChatsList: [],
      update: true,
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
        rightSubtitle={item.hasNewMessages ? 'NEW MESSAGES' : ''}
        subtitleStyle={styles.listSubtitle}
        rightSubtitleStyle={styles.listSubtitle}
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

      for (var i = 0 ; i < list.length; ++i) {
        var item = list[i];
        this.hasNewMessages(list[i], i);
        console.log(item);
      }

      this.setState({myChatsList: list.reverse()});
    } catch (error) {
      // Error retrieving data
    }
  };

  hasNewMessages = async (item, index) => {

    let ret = 0;
    let channelName = 'screenChat:_dev_en_' + (item.id).toString();
    channel = global.ably.channels.get(channelName);

    global.classObj = this;
    await channel.history({limit: 1}, function(err, resultPage) {
      if(err) {
        console.log('Unable to get channel history; err = ' + err.message);
        ret = 0;
      } else {
        AsyncStorage.getItem("msgTimestamps")
          .then(timestamps => {
            if (timestamps != null && resultPage.items.length > 0) {
              timestamps = JSON.parse(timestamps);
              if (timestamps[item.id] < resultPage.items[0].timestamp)
                ret = 1;
              item.hasNewMessages = ret;
              global.classObj.setState({update: !global.classObj.state.update});
            }
          })
          .done(() => {
          });
      }
    });

    return ret;
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps='handled'
          keyExtractor={this.keyExtractor}
          data={this.state.myChatsList}
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
