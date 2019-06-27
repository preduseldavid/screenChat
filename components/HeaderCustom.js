import React from 'react';
import { Image, Icon } from 'react-native-elements';
import Colors from '../constants/Colors';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

export default class HeaderCustom extends React.Component {
  render() {
    return (
      <View style={styles.header}>

        <StatusBar
          backgroundColor={Colors.customYellow}
          barStyle="dark-content"
        />

        <TouchableOpacity style={{ marginLeft: 6 }} onPress={this.props.goBack}>
          <Icon
            name='arrow-back'
            size={30}
            color={Colors.customGray}
          />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.headerTitle}>{this.props.title}</Text>

        <TouchableOpacity style={{ marginRight: 6 }}>
          <Icon
            name='menu'
            size={30}
            color={Colors.customYellow}
          />
        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  header: {
    flex: 0,
    flexDirection: 'row',
    height: 50,
    backgroundColor: Colors.customYellow,
    paddingTop: 5,
  },
  headerTitle: {
    textAlign:"center",
    flex:1,
    color: Colors.customGray,
    fontSize: 20,
    fontFamily: 'Lato-Bold',
    paddingTop: 3,
  },
});
