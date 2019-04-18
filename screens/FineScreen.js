import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';

export default class FineScreen extends React.Component {
  static navigationOptions = {
    title: "Fines"
  };

  render() {
    return (
      <View>
          <MonoText>Fines</MonoText>
      </View>
    );
  }
}
const styles = StyleSheet.create({

});
