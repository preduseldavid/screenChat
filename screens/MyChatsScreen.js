
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

import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  withMenuContext,
  renderers,
} from 'react-native-popup-menu';
const { SlideInMenu } = renderers;

export default class MyChatsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  openMenu(item) {
    this.setState({menuItem: item});
    this.menu.open();
  }

  onRef = r => {
    this.menu = r;
  }

  onOptionSelect(value) {
    if (value === 1) {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete this chat?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Yes', onPress: () =>  this.deleteChat(this.state.menuItem) },
        ]
      );
    }
    this.menu.close();
  }

  constructor(props) {
    super(props);
    this.state = {
      uniqueId: DeviceInfo.getUniqueID(),
      myChatsList: [],
      ablyChannels: [],
      update: true,
      menuItem: null,
    };

  };

  componentDidMount = () => {
    this.retrieveMyChatsList();

    this.props.navigation.addListener(
    'didFocus',
      payload => {
        this.retrieveMyChatsList();
        var navParams = this.props.navigation.state.params;
        if (navParams) {
          if (navParams.deleteItem)
            this.deleteChat(navParams.deleteItem);
          if (navParams.setTopOfMyChatsList)
            this.setTopOfMyChatsList(navParams.setTopOfMyChatsList);
        }
      }
    );


    this.props.navigation.addListener(
    'didBlur',
      payload => {
        //this.unsubscribeFromAll();
      }
    );
  };

  async deleteChat(item) {
    try {
      var list = await AsyncStorage.getItem('myChatsList');
      if (list != null)
        list = JSON.parse(list);
      else
        list = [];

      list = list.filter((element) => {
        return element.id != item.id;
      });

      AsyncStorage.setItem('myChatsList', JSON.stringify(list));
      this.setState({myChatsList: list});
    }
    catch (error) {
      console.log(error);
    }

  };

  updateMyChatsList = (payload) => {
    newList = global.MyChatsNewList;
    if (newList != null) {
      global.MyChatsNewList = [];

      list = this.state.myChatsList;
      newList = newList.concat(list);
      this.setState({myChatsList: newList});
    }
    else
      newList = this.state.myChatsList;


    // new messages
    for (var i = 0 ; i < newList.length; ++i) {
      //this.checkNewMessages(newList[i]);
    }
  };

  keyExtractor = (item, index) => index.toString();

  goToChatItem = (item) => {
    item.hasNewMessages = false;
    this.props.navigation.navigate({ routeName: 'MovieChat',  params: { movie: item } })
  };

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this.goToChatItem(item)} onLongPress={() => this.openMenu(item)}>
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



  retrieveMyChatsList = async () => {
    try {
      var list = await AsyncStorage.getItem('myChatsList');
      if (list != null)
        list = JSON.parse(list);
      else
        list = [];

      console.log(list);

      this.setState({myChatsList: list.reverse()});
    } catch (error) {
      // Error retrieving data
    }
  };

  checkNewMessages = async (item) => {
    try {
      if (item.hasNewMessages)
        return;

      let channelName = 'screenChat:dev_en_' + (item.id).toString();
      let channel = global.ably.channels.get(channelName);

      var ablyChannels = this.state.ablyChannels;
      ablyChannels.push(channel);
      this.setState({ ablyChannels: ablyChannels });

      await channel.history({limit: 1}, (err, resultPage) => {
        if(err) {
          console.log('Unable to get channel history; err = ' + err.message);
        } else {
          AsyncStorage.getItem("msgTimestamps")
            .then(timestamps => {
                if (timestamps != null && resultPage.items.length > 0) {
                timestamps = JSON.parse(timestamps);

                var hasNewMessages = timestamps[item.id.toString()] < resultPage.items[0].timestamp;
                item.hasNewMessages = hasNewMessages;
                this.setState({update: !this.state.update});

                if (!hasNewMessages) {
                  console.log('SET update for ' + item.id);
                  channel.subscribe(msg => {
                    console.log(msg);
                    item.hasNewMessages = true;
                    this.setState({update: !this.state.update});
                    channel.unsubscribe();
                  });
                }
              }
            });
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  async unsubscribeFromAll() {
    var ablyChannels = this.state.ablyChannels;

    for (var i = 0 ; i < ablyChannels.length; ++i)
      ablyChannels[i].unsubscribe();
  }

  render() {
    return (
      <MenuProvider
        backHandler={true}
        skipInstanceCheck={true}
        backdrop={{backgroundColor: 'tomato', opacity: 0.5,}}
        menuProviderWrapper={{backgroundColor: 'tomato'}}
      >
        <ScrollView style={styles.container}>

            <Menu name={'chatsScreen'} renderer={SlideInMenu} style={styles.chatMenu} onSelect={value => this.onOptionSelect(value)}
              name="menu-1" ref={this.onRef}>
              <MenuTrigger/>
              <MenuOptions>

                <MenuOption value={1}>
                  <Text style={styles.chatMenuOption}>Delete</Text>
                </MenuOption>

                <MenuOption value={2}>
                  <Text style={styles.chatMenuOption}>Cancel</Text>
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
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatMenu: {

  },
  chatMenuOption: {
    fontSize: 20,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.customGray,
    color: 'white',
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
