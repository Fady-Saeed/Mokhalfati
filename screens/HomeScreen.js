import React from 'react';
import { ImagePicker, Camera, Permissions } from 'expo';
import Constants from '../constants/Layout'

import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    image: null
  }
  componentDidUpdate(prevPops, prevState) {
    if (prevState.image !== this.state.image) {
      // Send the image to be processed
      // Change the screen to the results screen
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <MonoText style={styles.logo}>Mokhalafati</MonoText>
        <MonoText>Pick an image from:</MonoText>
        <View style={styles.flexRow}>
          <Button
            title="Gallery"
            onPress={this._pickImageFromGallery}
          />
          <Button
            title="Camera"
            onPress={this._pickImageFromCameraRoll}
          />
        </View>
      </View>

    );
  }

  _pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  _pickImageFromCameraRoll = async () => {
    const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
    const { statusCameraRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true })
    if (!result.cancelled) {
      this.setState({ image: result.uri })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    fontSize: 50,
    fontWeight: '500',
    paddingBottom: 50
  },
  flexRow: {
    flexDirection: 'row'
  }
});
