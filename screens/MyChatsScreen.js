
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

export default class MyChatsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      uniqueId: DeviceInfo.getUniqueID(),
      myChatsList: [],
      ablyChannels: [],
      update: true,
      actionSheetItem: null,
      actionSheetTitle: '',
      dialogVisible: false,
    };

    this.onLongPress = this.onLongPress.bind(this);
    this.onLongPressAction = this.onLongPressAction.bind(this);

    this.longPressActionSheet = null;
    this.navFocusListener = null;
    this.navBlurListener = null;
  };

  componentDidMount = () => {
    this.retrieveMyChatsList();

    this.navFocusListener = this.props.navigation.addListener(
      'didFocus',
          payload => {
            global.changeStatusBarColor(Colors.customYellow);
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


    this.navBlurListener = this.props.navigation.addListener(
      'didBlur',
          payload => {
            //this.unsubscribeFromAll();
          }
    );
  };

  onLongPress(item) {
    var title = (item.media_type == 'movie' ? item.title : item.name) + ' (' + item.media_type + ')';
    this.setState({ actionSheetItem: item });
    this.setState({actionSheetTitle: title});
    this.longPressActionSheet.show();
  }

  onLongPressAction(index) {
    var item = this.state.actionSheetItem;
    var itemName = item.media_type == 'person' ? item.name : item.title;
    switch (index) {
      case 0:
        this.setState({dialogVisible: true});
        break;
      default:
        break;
    }
  }

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
      this.setState({myChatsList: list.reverse()});
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
      <ScrollView style={styles.container}>

        <ActionSheet
          ref={o => this.longPressActionSheet = o}
          title={this.state.actionSheetTitle}
          options={Platform.OS === 'ios' ? [
              'Delete Chat', 'cancel',
            ] : [
              <Text style={styles.actionSheetTextStyle}>Delete Chat</Text>,
              <Text style={styles.actionSheetCancelStyle}>cancel</Text>,
          ]}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this.onLongPressAction}
        />

        <ConfirmDialog
          title="Confirmation"
          titleStyle={styles.latoText}
          dialogStyle={styles.latoText}
          buttonsStyle={styles.latoText}
          message="Are you sure want to delete this chat?"
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
              title: "YES",
              onPress: () => {
                this.setState({dialogVisible: false});
                this.deleteChat(this.state.actionSheetItem);
              }
          }}
          negativeButton={{
              title: "NO",
              onPress: () => this.setState({dialogVisible: false})
          }}
        />

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
  actionSheetTextStyle: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Lato-Regular',
  },
  actionSheetCancelStyle: {
    color: 'red',
    fontSize: 18,
    fontFamily: 'Lato-Regular',
  }
});
