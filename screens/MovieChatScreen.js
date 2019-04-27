import React, { Component } from 'react';
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
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';


var Realtime = require("ably").Realtime;
var ably, channel;
var MovieChatScreenGlobal;

export default class MovieChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    var item = navigation.getParam('movie');
    global.movie = item;
    var title = item.media_type == 'movie' ? item.title : item.name;
    return {
      title: title,
      headerStyle: {
        elevation: 0,
        backgroundColor: Colors.customYellow,
        height: 40,
      },
      headerTitleStyle: { 
        textAlign:"center", 
        flex:1,
        color: 'white',
      },
      headerLeft:(
        <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => navigation.navigate({ routeName: 'Search'})}>
          <Icon
            name='arrow-back'
            size={30}
            color='white'
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity style={{ marginRight: 6 }} onPress={this.navigateBack}>
          <Icon
            name='more-vert'
            size={30}
            color='white'
          />
        </TouchableOpacity>
        
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      user: 'Nobody',
      uniqueId: DeviceInfo.getUniqueID(),
      sendMessageText: '',
      msgData: [],
    };
    sendMessageInput = null;
    movie = this.props.navigation.state.params.movie;
    flatList = null;
  }

  componentDidMount = () => {
    MovieChatScreenGlobal = this;
    this.subscribe();
  };

  navigateBack = () => {
    console.log(this.props.navigation);
    this.props.navigation.navigate({ routeName: 'Search'});
  };

  _storeData = async () => {
    try {
      var list = await AsyncStorage.getItem('myChatsList');
      console.log(list);
      if (list != null)
        list = JSON.parse(list);
      else 
        list = [];

      for (var i = 0; i < list.length; ++i)
        if (list[i].id == global.movie.id)
          return;

      list.push(global.movie);
      console.log(global.movie);
      await AsyncStorage.setItem('myChatsList', JSON.stringify(list));
    } catch (error) {
      console.log(error);
    }
  };

  subscribe = () => {
    let channelName = 'screenChat:en_' + (this.props.navigation.state.params.movie.id).toString();
    ably = new Realtime({
      key: "TPURNw.X4pdwg:1gMMoqxLUl30a7lm",
      clientId: this.state.uniqueId
    });
    channel = ably.channels.get(channelName);
    console.log(channelName);
    
    // Get live message
    channel.subscribe("message", msg => {
      var newMsgData = this.state.msgData;
      newMsgData.push(msg);
      this.setState({ msgData: newMsgData });

      // this msg is mine, I wrote to this chat => store it to my chats
      if (msg.clientId === this.state.uniqueId) {
        this._storeData();
        console.log(msg);
      }
    });

    channel.attach(function() {
      channel.history(function(err, resultPage) {
        if(err) {
          console.log('Unable to get channel history; err = ' + err.message);
        } else {
          console.log(resultPage);
          MovieChatScreenGlobal.setState({ msgData: resultPage.items.reverse() });
        }
      });
    });

  };







  sendMessage = () => {
    if (this.sendMessageInput.props.value == '')
      return;

    this.sendMessageInput.clear();
    channel.publish('message', this.state.sendMessageText, function(err) {
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
                  <Text style={[itemText]}>{item.data}</Text>
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
    flex:1
  },
  list:{
    paddingHorizontal: 5,
  },
  footer:{
    flexDirection: 'row',
    height:60,
    backgroundColor: 'white',
    paddingHorizontal:10,
    padding:5,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray2
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
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightGray3,
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
  },
  itemOut: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.customYellow,
    borderBottomLeftRadius:10,
    borderTopLeftRadius:10,
  },
  itemInText: {
    color: 'black'
  },
  itemOutText: {
    color: 'white'
  },
  time: {
    alignSelf: 'flex-end',
    margin: 10,
    fontSize:12,
    color: Colors.lightGray3,
  },
  item: {
    marginVertical: 4,
    flex: 1,
    flexDirection: 'row',
    padding:2,
  },
}); 