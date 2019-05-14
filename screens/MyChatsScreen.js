
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
  FlatList
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from '../constants/Colors';
import { ListItem } from 'react-native-elements';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';

import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  withMenuContext,
} from 'react-native-popup-menu';

var channel;

export default class MyChatsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  openMenu(item) {
    this.menu.open();
  }

  onRef = r => {
    this.menu = r;
  }

  onOptionSelect(value) {
    alert(`Selected number: ${value}`);
    if (value === 1) {
      this.menu.close();
    }
    return false;
  }

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

    this.props.navigation.addListener(
    'didFocus',
      payload => {
        this.updateMyChatsList(payload);
      }
    );
  };

  updateMyChatsList = (payload) => {
    newList = global.MyChatsNewList;
    if (newList != null) {
      global.MyChatsNewList = [];
      console.log(newList);

      for (var i = 0 ; i < newList.length; ++i) {
          var item = newList[i];
          this.hasNewMessages(item);
        }

      list = this.state.myChatsList;
      newList = newList.concat(list);
      this.setState({myChatsList: newList});
    }
    else
      newList = this.state.myChatsList;


      // new messages
      for (var i = 0 ; i < newList.length; ++i) {
        var item = newList[i];
        this.hasNewMessages(newList[i]);
      }
  };

  keyExtractor = (item, index) => index.toString();

  _goToChatItem = (item) => {
    this.props.navigation.navigate({ routeName: 'MovieChat',  params: { movie: item } })
  };

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this._goToChatItem(item)} onLongPress={() => this.openMenu(item)}>
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

  addChatList = (newChat) => {
    var chatsList = this.state.myChatsList;
    chatsList.push(newChat);
    console.log(chatsList);
    this.setState({ myChatsList: chatsList });
  }



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
        this.hasNewMessages(list[i]);
        console.log(item);
      }

      this.setState({myChatsList: list.reverse()});
    } catch (error) {
      // Error retrieving data
    }
  };

  hasNewMessages = async (item) => {

    let ret = 0;
    let channelName = 'screenChat:dev_en_' + (item.id).toString();
    channel = global.ably.channels.get(channelName);

    await channel.history({limit: 1}, (err, resultPage) => {
      if(err) {
        console.log('Unable to get channel history; err = ' + err.message);
        ret = 0;
      } else {
        AsyncStorage.getItem("msgTimestamps")
          .then(timestamps => {
            if (timestamps != null && resultPage.items.length > 0) {
              timestamps = JSON.parse(timestamps);
              if (timestamps[item.id.toString()] < resultPage.items[0].timestamp)
                ret = 1;
              item.hasNewMessages = ret;
              console.log(item);
              this.setState({update: !this.state.update});
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


        <Menu name={'chatsScreen'} style={styles.chatMenu} onSelect={value => this.onOptionSelect(value)}
          name="menu-1" ref={this.onRef}>
          <MenuTrigger/>
          <MenuOptions>

            <MenuOption value={1} onSelect={() => {}} >
              <Text style={styles.chatMenuOption}>Mark as Read</Text>
            </MenuOption>

            <MenuOption value={2} onSelect={() => {}} >
              <Text style={styles.chatMenuOption}>Delete</Text>
            </MenuOption>

          </MenuOptions>
        </Menu>


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
  chatMenu: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: '20%',
  },
  chatMenuOption: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 10,
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
