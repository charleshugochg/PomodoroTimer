import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

export default class Wheel extends React.Component {
  onLong = (callback) => {
    this.interval = setInterval(callback, this.props.interval);
  };

  onRelease = () => {
    clearInterval(this.interval);
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.props.onUp}
          onLongPress={() => this.onLong(this.props.onUp)}
          onPressOut={this.onRelease}>
          <Text style={[styles.btn, {color: this.props.foreground}]}>+</Text>
        </TouchableOpacity>
        <Text style={[styles.value, {color: this.props.foreground}]}>
          {('0' + this.props.value).slice(-2)}
        </Text>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.props.onDown}
          onLongPress={() => this.onLong(this.props.onDown)}
          onPressOut={this.onRelease}>
          <Text style={[styles.btn, {color: this.props.foreground}]}>
            {'\u2212'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  btn: {
    fontSize: 57,
  },
  value: {
    fontSize: 57,
  },
});
