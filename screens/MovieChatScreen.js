import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import { Icon } from 'react-native-elements';

import {
  GiftedChat,
  Actions,
  Bubble,
  SystemMessage,
  Time,
  Day,
  Send,
  LoadEarlier,
  Composer,
  MessageText,
} from 'react-native-gifted-chat';
import Colors from '../constants/Colors';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderMovieChat from '../components/HeaderMovieChat';
import ActionSheet from 'react-native-actionsheet';
import Communications from 'react-native-communications';
import { ConfirmDialog } from 'react-native-simple-dialogs';

export default class MovieChatScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {
        _id: DeviceInfo.getUniqueID(),
        name: '',
      },
      messages: [],
      sendMessageText: '',
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      lastMsgTimestamp: null,
      historyResultPage: null,
      setTopOfMyChatsList: false,
      currentMessage: null,
      dialogVisible: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.onLongPressAction = this.onLongPressAction.bind(this);
    this.onPressPhoneNumber = this.onPressPhoneNumber.bind(this);
    this.onPressPhoneNumberAction = this.onPressPhoneNumberAction.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this.renderTime = this.renderTime.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.goToSettings = this.goToSettings.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.deleteChat = this.deleteChat.bind(this);
    this.goBack = this.goBack.bind(this);

    this.longPressActionSheet = null;
    this.PhoneActionSheet = null;

    this.movie = this.props.navigation.state.params.movie;
    this.ablyChannel = null;
    this.navFocusListener = null;
    this.navBlurListener = null;
  }

  componentWillMount() {
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: [
          {
            _id: Math.round(Math.random() * 1000000),
            text: "You joined this Chat.",
            createdAt: Date.now(),
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

    // When we enter the screen
    this.navFocusListener = this.props.navigation.addListener(
    'didFocus',
      payload => {
        this.ablySubscribe();
        this.onLoadEarlier();
      }
    );

    // When we leave the screen
    this.navBlurListener = this.props.navigation.addListener(
    'didBlur',
      payload => {
        this.ablyUnsubscribe();
      }
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    //this.navFocusListener.remove();
    //this.navBlurListener.remove();
  }

  async setTopOfMyChatsList() {
    try {
      var list = await AsyncStorage.getItem('myChatsList');
      if (list != null)
        list = JSON.parse(list);
      else
        list = [];

      list = list.filter((element) => {
        return element.id != this.movie.id;
      });
      list.push(this.movie);

      AsyncStorage.setItem('myChatsList', JSON.stringify(list));
      this.setState({myChatsList: list});
    } catch (error) {
      console.log(error);
    }
  }

  goToSettings() {
    this.props.navigation.navigate({ routeName: 'Username', params: {
      redirectSuccess: 'MovieChat',
      callbackSuccess: this.updateUsername,
    }});
  };

  updateUsername(value) {
    var obj = this.state.user;
    obj.name = value;
    this.setState({ user: obj });
  };

  deleteChat() {
    this.setState({dialogVisible: true});
  };

  goBack() {
    this.props.navigation.goBack(null);
  }

  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
      const paddingToTop = 0;
      return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
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
        if (!nextPage) return;
        var length = nextPage.items.length;
        var messages = [];
        for (var i = 0; i < nextPage.items.length; ++i) {
          messages.push(JSON.parse(nextPage.items[i].data));
        }

        if (nextPage.items.length > 0)
            this.updateLastMsgTimestamp(nextPage.items[0].timestamp);

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
            if (!resultPage) return;
            var length = resultPage.items.length;
            var messages = [];
            for (var i = 0; i < resultPage.items.length; ++i) {
              messages.push(JSON.parse(resultPage.items[i].data));
            }

            if (resultPage.items.length > 0)
                this.updateLastMsgTimestamp(resultPage.items[0].timestamp);

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

      this.updateLastMsgTimestamp(msg.timestamp);

      // This msg is mine, I wrote to this chat => store it to my chats
      if (msg.data.user._id === this.state.user._id) {
        //this.storeMovieChat();
      }
      else {
        this.onReceive(msg);
      }
    });
  }

  ablyUnsubscribe() {
    this.ablyChannel.detach();
    this.ablyChannel.unsubscribe();
  }

  ablyPublish(messages) {
    if (!this.state.setTopOfMyChatsList) {
      this.setState({setTopOfMyChatsList: true});
      this.setTopOfMyChatsList();
    }

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

  async storeMovieChat() {
    try {
      var list = await AsyncStorage.getItem('myChatsList');
      if (list != null)
        list = JSON.parse(list);
      else
        list = [];

       // Already stored on Disk
      for (var i = 0; i < list.length; ++i)
        if (list[i].id == this.movie.id)
          return;

      list.push(this.movie);
      await AsyncStorage.setItem('myChatsList', JSON.stringify(list));

      // Already stored in RAM for adding it (to Disk)
      if (global.MyChatsNewList == null)
        global.MyChatsNewList = [];
      for (var i = 0; i < global.MyChatsNewList.length; ++i)
        if (global.MyChatsNewList[i].id == this.movie.id)
          return;
      global.MyChatsNewList.unshift(this.movie);

    } catch (error) {
      console.log(error);
    }
  };

  async updateLastMsgTimestamp(timestamp) {
    if (this.state.lastMsgTimestamp == null ||
      this.state.lastMsgTimestamp < timestamp) {
      console.log(timestamp);
      this.setState({lastMsgTimestamp: timestamp});

      var timestamps = await AsyncStorage.getItem('msgTimestamps');
      if (timestamps != null)
        timestamps = JSON.parse(timestamps);
      else
        timestamps = {};
     timestamps[this.movie.id.toString()] = timestamp;
     await AsyncStorage.setItem('msgTimestamps', JSON.stringify(timestamps));
     console.log(timestamps);
   }
 };

  onLongPress(context, currentMessage) {
    this.setState({ currentMessage: currentMessage });
    this.longPressActionSheet.show();
  }

  onLongPressAction(index) {
    switch (index) {
      case 0:
        Clipboard.setString(this.state.currentMessage.text);
        break;
      default:
        break;
    }
  }

  renderMessageText(props) {
    return (
      <MessageText
        {...props}
      />
    );
  }

  onPressPhoneNumber(phone) {
    this.setState({ currentMessage: phone });
    this.PhoneActionSheet.show();
  }

  onPressPhoneNumberAction(index) {
    var phone = this.state.currentMessage;
    switch (index) {
      case 0:
          Communications.phonecall(phone, true);
          break;
      case 1:
          Communications.text(phone);
          break;
      default:
          break;
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        usernameStyle={{
          color: Colors.timeTextColor,
          fontFamily: 'Lato-Regular',
        }}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.lightGray3,
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
            fontFamily: 'Lato-Regular',
          },
          right: {
            color: 'black',
            fontFamily: 'Lato-Regular',
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

  renderComposer(props) {
    return (
      <Composer
        {...props}
        textInputStyle={{
          fontFamily: 'Lato-Regular'
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
                       fontFamily: 'Lato-Regular',
                   },
                   left: {
                       color: Colors.timeTextColor,
                       fontFamily: 'Lato-Regular',
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
          color: 'white',
          fontSize: 14,
          fontFamily: 'Lato-Regular',
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

  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{
          color: 'white',
          fontFamily: 'Lato-Regular',
        }}
      />
    );
  }

  renderSend(props) {
    return(
        <Send
          {...props}
          textStyle={{
            color: 'white',
            fontFamily: 'Lato-Regular',
            backgroundColor: Colors.customGray,
            borderRadius: 15
          }}
          label={' SEND '}
        />
      );
  }

  renderLoadEarlier(props) {
    return(
        <LoadEarlier
          {...props}
          wrapperStyle={{
            backgroundColor: Colors.customYellowLight,
          }}
          textStyle={{
            color: 'black',
            fontFamily: 'Lato-Regular',
          }}
        />
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderMovieChat
          title={this.movie.media_type == 'movie' ? this.movie.title : this.movie.name}
          goBack={this.goBack}
          deleteChat={this.deleteChat}
          goToSettings={this.goToSettings}
        />
        <ImageBackground
          source={{ uri: (this.movie.media_type == 'person'
            ? 'http://image.tmdb.org/t/p/w300' + this.movie.profile_path
            : 'http://image.tmdb.org/t/p/w300' + this.movie.poster_path)}}
          style={styles.posterImg}
        />

        <ActionSheet
          ref={o => this.longPressActionSheet = o}
          options={Platform.OS === 'ios' ?
            [
              'Copy Text', 'cancel'
            ] : [
              <Text style={styles.actionSheetTextStyle}>Copy Text</Text>,
              <Text style={styles.actionSheetCancelStyle}>cancel</Text>,
          ]}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this.onLongPressAction}
        />

        <ActionSheet
          ref={o => this.PhoneActionSheet = o}
          options={Platform.OS === 'ios' ?
            [
              'Call', 'Text', 'cancel'
            ] : [
            <Text style={styles.actionSheetTextStyle}>Call</Text>,
            <Text style={styles.actionSheetTextStyle}>Text</Text>,
            <Text style={styles.actionSheetCancelStyle}>cancel</Text>,
          ]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this.onPressPhoneNumberAction}
        />

        <ConfirmDialog
          title="Confirmation"
          titleStyle={styles.latoText}
          dialogStyle={styles.latoText}
          buttonsStyle={styles.latoText}
          message="Are you sure you want to delete this chat?"
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
              title: "YES",
              onPress: () => this.props.navigation.navigate({ routeName: 'MyChats',  params: { deleteItem: this.movie } })
          }}
          negativeButton={{
              title: "NO",
              onPress: () => this.setState({dialogVisible: false})
          }}
        />

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}

          user={this.state.user}

          parsePatterns={(linkStyle) => [
            { type: 'phone', style: linkStyle, onPress: this.onPressPhoneNumber },
          ]}
          onLongPress={this.onLongPress}
          renderMessageText={this.renderMessageText}
          renderBubble={this.renderBubble}
          renderComposer={this.renderComposer}
          renderTime={this.renderTime}
          renderSystemMessage={this.renderSystemMessage}
          renderFooter={this.renderFooter}
          renderDay={this.renderDay}
          renderSend={this.renderSend}
          renderLoadEarlier={this.renderLoadEarlier}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          renderAvatar={() => null}
          keyboardShouldPersistTaps={'never'}
          listViewProps={{
            scrollEventThrottle: 400,
            onScroll: ({ nativeEvent }) => { if (this.isCloseToTop(nativeEvent)) this.onLoadEarlier(); }
          }}
          text={this.state.sendMessageText}
          onInputTextChanged={(txtInput) => {
            this.setState({sendMessageText: txtInput});
          }}
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
    marginTop: 50,
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
    fontFamily: 'Lato-Regular',
  },
  latoText: {
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
