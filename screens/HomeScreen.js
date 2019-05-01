import React from "react";
import { ImagePicker, Camera, Permissions } from "expo";
import GlobalStyle from "../constants/GlobalStyles";

import {
  Button,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";

import { MonoText } from "../components/StyledText";
const styles = StyleSheet.create({
  text: {
    marginTop: 11,
    fontWeight: "bold"
  }
});

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    image: null
  };

  componentDidUpdate(prevPops, prevState) {
    if (prevState.image !== this.state.image) {
      this.props.navigation.navigate("Fines", {
        image: this.state.image,
        image64: this.state.image64
      });
    }
  }

  render() {
    return (
      <View style={GlobalStyle.container}>
        <Image source={require("../assets/images/MokhalfatiLOGO.png")} />
        {/*<MonoText style={GlobalStyle.logo}>Mokhalfati</MonoText>*/}
        <MonoText>Pick your car license ID image from:</MonoText>
        <View style={GlobalStyle.flexRow}>
          <Button title="Gallery" onPress={this._pickImageFromGallery} />
          <Text style={styles.text}> OR </Text>
          <Button title="Camera" onPress={this._pickImageFromCameraRoll} />
        </View>
      </View>
    );
  }

  _pickImageFromGallery = async () => {
    const { statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri, image64: result.base64 });
    }
  };
  _pickImageFromCameraRoll = async () => {
    const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
    const { statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, base64: true });
    if (!result.cancelled) {
      this.setState({ image: result.uri, image64: result.base64 });
    }
  };
}
