import React from 'react';
import { ImagePicker, Camera, Permissions } from 'expo';
import GlobalStyle from '../constants/GlobalStyles'

import {
  Button,
  Image,
  Platform,
  ScrollView,
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
      this.props.navigation.navigate('Fines',{
        image: this.state.image
      })
    }
  }
  render() {
    return (
      <View style={GlobalStyle.container}>
        <MonoText style={GlobalStyle.logo}>Mokhalafati</MonoText>
        <MonoText>Pick an image from:</MonoText>
        <View style={GlobalStyle.flexRow}>
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

