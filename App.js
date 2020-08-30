import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';

import vibrate from './utils/vibrate.js';

import ActionButton from './ActionButton.js';
import Wheel from './Wheel.js';

const limit = {
  min: 0,
  max: 60,
};

const limitRange = (val) => Math.max(Math.min(limit.max, val), limit.min);

export default class App extends React.Component {
  state = {
    intervals: {
      work: {
        min: 25,
        sec: 0,
      },
      breake: {
        min: 5,
        sec: 0,
      },
    },
    timeout: {
      min: 25,
      sec: 0,
    },
    current: 'work',
    isCounting: false,
    lastAction: 'reset',
  };

  constants = {
    theme: {
      work: {
        background: '#204060',
        foreground: '#eee',
      },
      breake: {
        background: '#eee',
        foreground: '#000',
      },
    },
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startCountdown = () => {
    this.interval = setInterval(() => this.countdown(this.onTimeup), 1000);
    this.setState((prev) => ({
      ...prev,
      isCounting: true,
    }));
    if (this.state.lastAction === 'reset') {
      this.setState((prev) => ({
        ...prev,
        intervals: {
          ...prev.intervals,
          [prev.current]: {
            ...prev.timeout,
          },
        },
        lastAction: 'update',
      }));
    }
  };

  stopCountdown = () => {
    clearInterval(this.interval);
    this.setState((prev) => ({
      ...prev,
      isCounting: false,
    }));
  };

  resetCountdown = () => {
    this.stopCountdown();
    this.setState((prev) => ({
      ...prev,
      timeout: {
        ...prev.intervals[prev.current],
      },
      lastAction: 'reset',
    }));
  };

  countdown = (callback) => {
    let min = this.state.timeout.min;
    let sec = this.state.timeout.sec - 1;
    if (min > limit.min && sec < limit.min) {
      min--;
      sec = limit.max + sec;
    }
    min = limitRange(min);
    sec = limitRange(sec);
    this.setState((prev) => ({
      ...prev,
      timeout: {
        min,
        sec,
      },
    }));
    if (min === 0 && sec === 0) {
      callback();
    }
  };

  onTimeup = () => {
    vibrate();
    this.toggleState();
  };

  toggleState = () => {
    const nextState = this.state.current === 'work' ? 'breake' : 'work';
    this.setState((prev) => ({
      ...prev,
      current: nextState,
    }));
    this.resetCountdown();
  };

  addToMin = (val) => {
    const min = this.state.timeout.min + val;
    this.setState({
      ...this.state,
      timeout: {
        min: limitRange(min, limit),
        sec: this.state.timeout.sec,
      },
    });
  };

  addToSec = (val) => {
    const sec = this.state.timeout.sec + val;
    this.setState({
      ...this.state,
      timeout: {
        min: this.state.timeout.min,
        sec: limitRange(sec, limit),
      },
    });
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.constants.theme[this.state.current]
              .background,
          },
        ]}>
        <View style={styles.wheelContainer}>
          <Wheel
            {...this.constants.theme[this.state.current]}
            interval={200}
            disabled={this.state.isCounting}
            value={this.state.timeout.min}
            onUp={() => this.addToMin(1)}
            onDown={() => this.addToMin(-1)}
          />
          <Text
            style={[
              styles.seperator,
              {color: this.constants.theme[this.state.current].foreground},
            ]}>
            :
          </Text>
          <Wheel
            {...this.constants.theme[this.state.current]}
            interval={200}
            disabled={this.state.isCounting}
            value={this.state.timeout.sec}
            onUp={() => this.addToSec(1)}
            onDown={() => this.addToSec(-1)}
          />
        </View>
        <View style={styles.btnContainer}>
          {this.state.isCounting ? (
            <ActionButton text={'p'} onPress={this.stopCountdown} />
          ) : (
            <ActionButton text={'s'} onPress={this.startCountdown} />
          )}
          {this.state.lastAction === 'reset' ? (
            <ActionButton text={'n'} onPress={this.toggleState} />
          ) : (
            <ActionButton
              text={'r'}
              onPress={this.resetCountdown}
              disabled={this.state.isCounting}
            />
          )}
        </View>
        <StatusBar
          barStyle={
            this.state.current === 'work' ? 'light-content' : 'dark-content'
          }
          backgroundColor={this.constants.theme[this.state.current].background}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seperator: {
    fontSize: 57,
    margin: 10,
    marginBottom: 22,
  },
});
