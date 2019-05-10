import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  ImageBackground,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import MyChatsScreen from './MyChatsScreen';


import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';


var MovieChatScreenGlobal;

export default class MovieChatScreen extends React.Component {

  changeUsername = () => {
    this.props.navigation.navigate({ routeName: 'Username', params: {
      redirectSuccess: 'MovieChat',
      callbackSuccess: this.updateUsername,
    }});
  };

  deleteChat = () => {

  };

  updateUsername = (newUsername) => {
    this.setState({ username: newUsername });
  };

  static navigationOptions = ({ navigation }) => {
    var item = navigation.getParam('movie');
    global.movie = item;
    var title = item.media_type == 'movie' ? item.title : item.name;
    return {
      title: title,
      headerStyle: {
        backgroundColor: Colors.lightGray3,
      },
      headerTitleStyle: {
        textAlign:"center",
        flex:1,
        color: Colors.customYellow,
      },
      headerLeft:(
        <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => navigation.goBack(null)}>
          <Icon
            name='arrow-back'
            size={30}
            color={Colors.customYellow}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <Menu name={'myChat'}>
        <MenuTrigger>
              <Icon
                name='more-vert'
                size={30}
                color={Colors.customYellow}
              />
          </MenuTrigger>

          <MenuOptions>
            <MenuOption onSelect={() => MovieChatScreenGlobal.changeUsername()} >
              <Text style={{color: 'black', fontSize: 16, paddingVertical: 10}}>Change Username</Text>
            </MenuOption>
            <MenuOption onSelect={() => MovieChatScreenGlobal.deleteChat()} >
              <Text style={{color: 'black', fontSize: 16, paddingVertical: 10}}>Delete Chat</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      uniqueId: DeviceInfo.getUniqueID(),
      sendMessageText: '',
      msgData: [],
      lastMsgTimestamp: null,
    };
    sendMessageInput = null;
    movie = this.props.navigation.state.params.movie;
    this.movie = this.props.navigation.state.params.movie;
    flatList = null;
    this.channel = null;
  }

  componentDidMount = () => {
    console.log('MOUNT');
    MovieChatScreenGlobal = this;

    AsyncStorage.getItem("username")
    .then(value => {
      this.setState({ username: value });
    })
    .done();

    // get last msg timestamp
    AsyncStorage.getItem("msgTimestamps")
    .then(timestamps => {
      if (timestamps != null) {
        console.log(timestamps);
        timestamps = JSON.parse(timestamps);
        this.setState({lastMsgTimestamp: timestamps[global.movie.id.toString()]});
      }
      else
        timestamps = {};
    })
    .done();

    componentWillUnmount = () => {
      console.log('UNMOUNT');
    };

    this.props.navigation.addListener(
    'didBlur',
      payload => {
        this.unsubscribe();
      }
    );

    this.props.navigation.addListener(
    'didFocus',
      payload => {
        this.subscribe();
      }
    );
  };


  updateUsername = () => {
    AsyncStorage.getItem("username")
    .then(value => {
      this.setState({ username: value });
    })
    .done();
  }


  navigateBack = () => {
    console.log(this.props.navigation);
    this.props.navigation.navigate({ routeName: 'Search'});
  };

  _updateLastMsgTimestamp = async (timestamp) => {
    console.log(this.state.lastMsgTimestamp);
    console.log(timestamp);
    console.log(this.state.lastMsgTimestamp < timestamp);
    if (this.state.lastMsgTimestamp == null || this.state.lastMsgTimestamp < timestamp) {
      console.log(timestamp);
      this.setState({lastMsgTimestamp: timestamp});

      var timestamps = await AsyncStorage.getItem('msgTimestamps');
      if (timestamps != null)
        timestamps = JSON.parse(timestamps);
      else
        timestamps = {};
      timestamps[global.movie.id.toString()] = timestamp;
      await AsyncStorage.setItem('msgTimestamps', JSON.stringify(timestamps));

    }
  };

  _storeData = async () => {
    try {
      var list = await AsyncStorage.getItem('myChatsList');
      console.log(list);
      if (list != null)
        list = JSON.parse(list);
      else
        list = [];

       // already stored
      for (var i = 0; i < list.length; ++i)
        if (list[i].id == global.movie.id)
          return;

      list.push(global.movie);
      console.log(global.movie);
      await AsyncStorage.setItem('myChatsList', JSON.stringify(list));

      // already stored for adding it
      if (global.MyChatsNewList == null)
        global.MyChatsNewList = [];
      for (var i = 0; i < global.MyChatsNewList.length; ++i)
        if (global.MyChatsNewList[i].id == global.movie.id)
          return;
      global.MyChatsNewList.unshift(global.movie);

    } catch (error) {
      console.log(error);
    }
  };

  unsubscribe = () => {
    console.log('UNSUBSCRIBE');
    this.channel.unsubscribe();
  };

  subscribe = () => {
    let channelName = 'screenChat:_dev_en_' + (this.props.navigation.state.params.movie.id).toString();
    this.channel = global.ably.channels.get(channelName);
    console.log(channelName);

    // Get live message
    this.channel.subscribe(msg => {
      msg.data = JSON.parse(msg.data);
      var newMsgData = this.state.msgData;
      newMsgData.push(msg);
      this.setState({ msgData: newMsgData });

      this._updateLastMsgTimestamp(msg.timestamp);

      // this msg is mine, I wrote to this chat => store it to my chats
      if (msg.clientId === this.state.uniqueId) {
        this._storeData();
        console.log(msg);
      }
    });


      this.channel.history({limit: 10}, function(err, resultPage) {
        if(err) {
          console.log('Unable to get channel history; err = ' + err.message);
        } else {
          console.log(resultPage);
          var length = resultPage.items.length;
          for (var i = 0; i < resultPage.items.length; ++i) {
            resultPage.items[i].data = JSON.parse(resultPage.items[i].data);
          }
          console.log(resultPage);
          console.log(resultPage.items);
          if (resultPage.items.length > 0)
            MovieChatScreenGlobal._updateLastMsgTimestamp(resultPage.items[0].timestamp);
          MovieChatScreenGlobal.setState({ msgData: resultPage.items.reverse() });
        }

        if (0 && resultPage.hasNext()) {
          resultPage.next(function(err, nextPage) {
            var oldMsgData = MovieChatScreenGlobal.state.msgData;
            for (var i = 0; i < nextPage.items.length; ++i) {
              nextPage.items[i].data = JSON.parse(nextPage.items[i].data);
              oldMsgData.unshift(nextPage.items[i]);
            }
            console.log(oldMsgData);
            MovieChatScreenGlobal.setState({ msgData: oldMsgData });
          });
        }
      });

  };







  sendMessage = () => {
    if (this.sendMessageInput.props.value == '')
      return;

    this.sendMessageInput.clear();
    let msg = {
      username: this.state.username,
      text: this.state.sendMessageText
    };
    this.channel.publish('', JSON.stringify(msg), function(err) {
      if(err) {
        console.log('Unable to publish message; err = ' + err.message);
      } else {
        console.log('Message successfully sent');
      }
    });

    this.setState({sendMessageText: ''});
  };

  renderDate = (date) => {
    return(
      <Text style={styles.time}>
        {date}
      </Text>
    );
  }

  render() {

    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: (this.movie.media_type == 'person'
            ? 'http://image.tmdb.org/t/p/w300' + this.movie.profile_path
            : 'http://image.tmdb.org/t/p/w300' + this.movie.poster_path)}}
          style={styles.posterImg}
        />
      <FlatList style={styles.list}
          onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
          ref={component => this.flatList = component}
          data={this.state.msgData}
          extraData={this.state.msgData}
          keyExtractor= {(item) => {
            return item.id.toString();
          }}
          renderItem={(message) => {
            const item = message.item;
            let inMessage = item.clientId !== this.state.uniqueId;
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            let itemText = inMessage ? styles.itemInText : styles.itemOutText;
            return (
              <View style={[styles.item, itemStyle]}>
                <View style={[styles.balloon]}>
                {inMessage && <Text style={styles.usernameTxt}>{item.data.username}</Text>}
                  <Text style={[itemText]}>{item.data.text}</Text>
                </View>
              </View>
            )
        }}/>
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              ref={component => this.sendMessageInput = component}
              placeholder="Write a message..."
              underlineColorAndroid='transparent'
              returnKeyType='send'
              onSubmitEditing={(event) => this.sendMessage()}
              onChangeText={(message) => this.setState({sendMessageText: message})}
              value={this.state.sendMessageText} />
          </View>

            <TouchableOpacity onPress={this.sendMessage} style={styles.btnSend}>
              <Image source={require('../assets/images/submit-btn.png')} style={styles.iconSend}  />
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#a9a9a9',
  },
  posterImg: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
    position: 'absolute',
  },
  list:{
    paddingHorizontal: 5,
  },
  footer:{
    flexDirection: 'row',
    height:60,
    paddingHorizontal:10,
    padding:5,
  },
  btnSend:{
    width:40,
    height:40,
    borderRadius:360,
    alignItems:'center',
    justifyContent:'center',
  },
  iconSend:{
    width:30,
    height:30,
    alignSelf:'center',
  },
  inputContainer: {
    borderColor: Colors.customYellow,
    backgroundColor: Colors.lightGray3,
    borderRadius:10,
    borderWidth: 1,
    height:40,
    flexDirection: 'row',
    alignItems:'center',
    flex:1,
    marginRight:10,
  },
  inputs:{
    height:40,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  balloon: {
    maxWidth: 250,
    padding: 10,
    borderRadius: 10,
  },
  itemIn: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightGray3,
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
  },
  itemOut: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.customYellowLight,
    borderBottomLeftRadius:10,
    borderTopLeftRadius:10,
  },
  usernameTxt: {
    alignSelf: 'flex-start',
    color: Colors.customYellow,
    fontSize:13,
    marginLeft: -5,
    marginTop: -12,
  },
  itemInText: {
    color: 'black',
    fontSize:15,
  },
  itemOutText: {
    color: 'black',
    fontSize:15,
  },
  time: {
    alignSelf: 'flex-end',
    margin: 10,
    fontSize:12,
    color: Colors.lightGray2,
  },
  item: {
    marginVertical: 4,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding:2,
  },
});
