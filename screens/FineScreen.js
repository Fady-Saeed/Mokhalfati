import React from "react";
import { ActivityIndicator, StyleSheet, View, Image, Text, Button } from "react-native";
import { ImagePicker, Camera, Permissions } from "expo";
import Colors from "../constants/Colors";
import Constants from "../constants/Layout";
import GlobalStyle from "../constants/GlobalStyles";
import { MonoText } from "../components/StyledText";
import { PLATE_FORMAT, getFines } from "../api/fines"
import { getDriverLicenseData } from "../api/driverLicenseDataExtractor"

export default class FineScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    firstLetter: null,
    secondLetter: null,
    thirdLetter: null,
    digits: null,
    isReady: true,
    fine: -1,
    image: null,
    licenseImage: null,
  };

  componentDidUpdate(prevPops, prevState) {
    if (prevState.licenseImage !== this.state.licenseImage) {
      this.props.navigation.navigate("Details", {
        image: this.state.licenseImage,
        image64: this.state.image64
      });
    }
  }

  componentDidMount() {
    this._getFines();
  }
  render() {
    if (!this.state.isReady) {
      return (
        <View style={GlobalStyle.container}>
          <ActivityIndicator size="large" color={Colors.tintColor} />
        </View>
      );
    }
    return (
      <View style={GlobalStyle.container}>
        <Image source={require("../assets/images/MokhalfatiLOGO.png")} style={{ height: 150, width: 150 }} />
        <Text> {this.state.firstLetter}{this.state.secondLetter}{this.state.thirdLetter}{this.state.digits}</Text>
        <Image source={{ uri: this.state.image }} style={styles.image} />
        {(this.state.fine) ? (
          <View style={{ alignItems: "center" }}>

            <Text style={{ fontSize: 20, fontWeight: "bold" }}>You have to pay {this.state.fine} EGP {"\n"} </Text>

            <Text style={{ fontWeight: "bold", color: "#ff0000" }}> Need more Details ? {"\n"} </Text>
            <Text style={{ fontSize: 16 }}>Pick car owner driving license image from:</Text>
            <View style={GlobalStyle.flexRow}>
              <Button title="Gallery" onPress={this._pickImageFromGallery} />
              <Text style={styles.text}> OR </Text>
              <Button title="Camera" onPress={this._pickImageFromCameraRoll} />
            </View>
          </View>
        ) : null}
        {(!this.state.fine) ? (
          <View style={GlobalStyle.flexRow}>
            <Text style={GlobalStyle.textBold}>You don't have to pay a penny</Text>
          </View>
        ) : null}
      </View>
    );
  }
  _getFines = async () => {
    // Send the image to be processed
    const driverLicenseData = await getDriverLicenseData(this.props.navigation.getParam("image64"))
    // Get fines from the traffic fines api
    const driverLicense = {
      type: PLATE_FORMAT.ALPHA_NUMERIC,
      firstLetter: driverLicenseData.firstLetter,
      secondLetter: driverLicenseData.secondLetter,
      thirdLetter: driverLicenseData.thirdLetter,
      digits: driverLicenseData.digits
    }
    const fine = await getFines(driverLicense)
    // Update the screen state
    this.setState({
      firstLetter: driverLicenseData.firstLetter,
      secondLetter: driverLicenseData.secondLetter,
      thirdLetter: driverLicenseData.thirdLetter,
      digits: driverLicenseData.digits,
      isReady: true,
      image: this.props.navigation.getParam("image"),
      fine: fine
    });
  };

  _pickImageFromGallery = async () => {
    const { statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true
    });
    if (!result.cancelled) {
      this.setState({ licenseImage: result.uri, image64: result.base64 });
    }
  };
  _pickImageFromCameraRoll = async () => {
    const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
    const { statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, base64: true });
    if (!result.cancelled) {
      this.setState({ licenseImage: result.uri, image64: result.base64 });
    }
  };

}

const styles = StyleSheet.create({
  image: {
    width: Constants.window.width,
    height: 300,
    resizeMode: "contain"
  },
  text: {
    marginTop: 11,
    fontWeight: "bold"
  }
});
