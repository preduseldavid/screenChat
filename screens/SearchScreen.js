import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Button,
  FlatList,
  StatusBar
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from '../constants/Colors';
import { ListItem } from 'react-native-elements';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import SplashScreen from 'react-native-splash-screen';

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchData: [],
    };
  }

  componentDidMount() {

  }

  _getUsername = () => {
    AsyncStorage.getItem("userName")
      .then(value => {
        this.setState({ user: value });
        this.subscribe();
      })
      .done();
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this._goToSearchItem(item)}>
      <ListItem
        containerStyle={styles.listItem}
        title={item.media_type == 'movie' ? item.title : item.name}
        titleStyle={styles.listTitle}
        subtitle={item.media_type == 'person' ? 'Person' : (item.media_type == 'movie' ? 'Movie' : 'Tv Show')}
        subtitleStyle={styles.listSubtitle}
        leftIcon={{ name: item.media_type }}
        pad={8}
      />
    </TouchableHighlight>
  );

  render() {
    return (
      <View style={styles.container}>

        <View
          style={{
            backgroundColor: {Colors.customYellow},
            height: Platform.OS === 'ios' ? 20 : 0,
          }}>
          <StatusBar
            backgroundColor={Colors.customYellow}
            barStyle="dark-content"
          />
        </View>

        <HideWithKeyboard>
          <Image style={styles.searchLogo} source={require('../assets/images/logo-full.png')} />
        </HideWithKeyboard>

        <View style={styles.searchContainer}>
          <SearchBar
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchInputContainer}
            onChangeText={text => this._searchBarChange(text)}
            value={this.state.searchText}
            placeholder={'Search Movie, Tv Show, Actor...'}
            placeholderTextColor={Colors.lightGray1}
            inputStyle={styles.searchInput}
          />

          <FlatList
            keyboardShouldPersistTaps='handled'
            keyExtractor={this.keyExtractor}
            data={this.state.searchData}
            extraData={this.state.searchData}
            renderItem={this.renderItem}
          />
        </View>

      </View>
    );
  }

  _goToSearchItem = (item) => {
    this.props.navigation.navigate({ routeName: 'MovieChat',  params: { movie: item } })
  };

  _searchBarChange = (text) => {
    this.setState({
      searchText: text
    });

    if (text == '') {
      this.setState({searchData: []});
    }
    else {

      this._searchRequest(text);
    }
  };

  _searchRequest = (searchText) => {
    var url = 'https://api.themoviedb.org/3/search/multi?api_key=1922557a7287f1dd113f0ff672f93dcd&language=en-US&query=' + encodeURI(searchText) + '&include_adult=true';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          //isLoading: false,
          searchData: responseJson.results,
        }, function(){
          console.log(responseJson);
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'Lato-Regular',
  },
  searchContainer: {
    flex: 1,
    alignSelf: 'center',
    width: '80%',
    marginTop: 5,
  },
  searchBarContainer: {
    backgroundColor: '#fff',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    padding: '0%',
  },
  searchInputContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: Colors.customYellow
  },
  searchInput: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
  },
  searchLogo: {
    alignSelf: 'center',
    width: '60%',
    height: 80,
    resizeMode: 'contain',
    marginTop: 40,
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
