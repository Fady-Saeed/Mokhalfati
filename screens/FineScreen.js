import React from "react";
import { ActivityIndicator, StyleSheet, View, Image, Text } from "react-native";
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
    isReady: false,
    fine: -1,
    image: null
  };
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
        <Image source={require("../assets/images/MokhalfatiLOGO.png")} />
        {/*<MonoText style={GlobalStyle.logo}>Mokhalafati</MonoText>*/}
        <Image source={{ uri: this.state.image }} style={styles.image} />
        {(this.state.fine)?(
          <View style={GlobalStyle.flexRow}>
            <Text style={GlobalStyle.textBold}>You have to pay </Text>
            <Text>{this.state.fine} EGP</Text>
          </View>
        ):null}
        {(!this.state.fine)?(
          <View style={GlobalStyle.flexRow}>
            <Text style={GlobalStyle.textBold}>You don't have to pay a penny</Text>
          </View>
        ):null}
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
      isReady: true,
      image: this.props.navigation.getParam("image"),
      fine: fine
    });
  };
}

const styles = StyleSheet.create({
  image: {
    width: Constants.window.width,
    height: 300,
    resizeMode: "contain"
  }
});
