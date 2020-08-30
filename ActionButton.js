import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';

export default class ActionButton extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.props.onPress}
          style={styles.touchable}
          disabled={this.props.disabled}>
          <Text style={styles.text}>{this.props.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  touchable: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textTransform: 'uppercase',
    fontSize: 32,
  },
});
