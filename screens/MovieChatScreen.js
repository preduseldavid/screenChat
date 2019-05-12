import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

import { GiftedChat, Actions, Bubble, SystemMessage, Time } from 'react-native-gifted-chat';
import Colors from '../constants/Colors';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default class MovieChatScreen extends React.Component {

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
      user: {
        _id: DeviceInfo.getUniqueID(),
        name: '',
      },
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      lastMsgTimestamp: null,
      historyResultPage: null,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this.renderTime = this.renderTime.bind(this);

    this.movie = this.props.navigation.state.params.movie;
    this.ablyChannel = null;
  }

  componentWillMount() {
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: [
          {
            _id: Math.round(Math.random() * 1000000),
            text: "You are officially rocking GiftedChat.",
            createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
            system: true,
          },
        ],
      };
    });

    // Get stored username
    AsyncStorage.getItem("username")
    .then(value => {
      var obj = this.state.user;
      obj.name = value;
      this.setState({ user: obj });
    })
    .done();

    // Get last msg timestamp
    AsyncStorage.getItem("msgTimestamps")
    .then(timestamps => {
      if (timestamps != null) {
        timestamps = JSON.parse(timestamps);
        this.setState({lastMsgTimestamp: timestamps[this.movie.id.toString()]});
      }
      else
        timestamps = {};
    })
    .done();

    this.ablySubscribe();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    if (this.state.historyResultPage) {
      this.state.historyResultPage.next((err, nextPage) => {
        console.log(nextPage);
        var length = nextPage.items.length;
        var messages = [];
        for (var i = 0; i < nextPage.items.length; ++i) {
          messages.push(JSON.parse(nextPage.items[i].data));
        }

        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, messages),
            loadEarlier: nextPage.hasNext(),
            isLoadingEarlier: false,
            historyResultPage: nextPage,
          }
        });
      });
    }
    else {
      this.ablyChannel.attach((err) => {
        this.ablyChannel.history({untilAttach: true, limit: 10}, (err, resultPage) => {
          if(err) {
            console.log('Unable to get channel history; err = ' + err.message);
          }
          else {
            var length = resultPage.items.length;
            var messages = [];
            for (var i = 0; i < resultPage.items.length; ++i) {
              messages.push(JSON.parse(resultPage.items[i].data));
            }

            if (this._isMounted === true) {
              this.setState((previousState) => {
                return {
                  messages: GiftedChat.prepend(previousState.messages, messages),
                  loadEarlier: resultPage.hasNext(),
                  isLoadingEarlier: false,
                  historyResultPage: resultPage,
                }
              });
            }
          }
        });
      });
    }

  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    // Send the msg to Ably Realtime Service
    this.ablyPublish(messages);
  }

  onReceive(message) {
    console.log(message);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: message.data._id,
          text: message.data.text,
          createdAt: new Date(message.data.createdAt),
          user: {
            _id: message.data.user._id,
            name: message.data.user.name,
          },
        }),
      };
    });
  }

  ablySubscribe() {
    let currentMovie = this.props.navigation.state.params.movie;
    let channelName = 'screenChat:dev_en_' + (currentMovie.id).toString();
    this.ablyChannel = global.ably.channels.get(channelName);

    console.log(channelName);
    // Get live message
    this.ablyChannel.subscribe(msg => {
      msg.data = JSON.parse(msg.data);

      //this.updateLastMsgTimestamp(msg.timestamp);

      // this msg is mine, I wrote to this chat => store it to my chats
      if (msg.data.user._id === this.state.user._id) {
        //this.storeData();
      }
      else {
        this.onReceive(msg);
      }
    });
  }

  ablyPublish(messages) {
    for (var i = 0; i < messages.length; ++i) {
      this.ablyChannel.publish('', JSON.stringify(messages[i]), function(err) {
        if(err) {
          console.log('Unable to publish message; err = ' + err.message);
        } else {
          console.log('Message successfully sent');
        }
      });
    }
  }

  async ablyHistory() {
    var items = [];
    try {
      await this.ablyChannel.history({untilAttach: true, limit: 10}, (err, resultPage) => {
        if(err) {
          console.log('Unable to get channel history; err = ' + err.message);
        } else {
          var length = resultPage.items.length;
          for (var i = 0; i < resultPage.items.length; ++i) {
            resultPage.items[i].data = JSON.parse(resultPage.items[i].data);
          }
          items = resultPage.items;
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
    }
    catch (rejectedValue) {
      // …
    }

    return items;
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        usernameStyle={{
          color: Colors.timeTextColor,
        }}
        tick={{
          color: Colors.timeTextColor,
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
            marginLeft: -10,
          },
          right: {
            backgroundColor: Colors.customYellowLight,
            marginRight: -10,
          }
        }}
        textStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: 'black',
          },
        }}
        linkStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: 'black',
          },
        }}
      />
    );
  }

  renderTime(props) {
       return (
           <Time
           {...props}
               textStyle={{
                   right: {
                       color: Colors.timeTextColor,
                   },
                   left: {
                       color: Colors.timeTextColor,
                   }
               }}
           />
       );
   }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          color: 'black',
          fontSize: 14,
        }}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
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
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}

          user={this.state.user}

          renderBubble={this.renderBubble}
          renderTime={this.renderTime}
          renderSystemMessage={this.renderSystemMessage}
          renderFooter={this.renderFooter}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          renderAvatar={() => null}
        />
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
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
