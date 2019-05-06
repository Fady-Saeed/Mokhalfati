import React from "react";
import { ActivityIndicator, StyleSheet, View, Image, Text, Button, Platform, Picker } from "react-native";
import { ImagePicker, Camera, Permissions } from "expo";
import * as Animatable from 'react-native-animatable';
import Colors from "../constants/Colors";
import Constants from "../constants/Layout";
import GlobalStyle from "../constants/GlobalStyles";
import { MonoText } from "../components/StyledText";
import { PLATE_FORMAT, getFines } from "../api/fines"
import { getCarLicenseData } from "../api/carLicenseDataExtractor"
import { ScrollView } from "react-native-gesture-handler";

export default class FineScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    hasOptions: false,
    OCRresult: null,
    firstLetter: null,
    secondLetter: null,
    thirdLetter: null,
    digits: null,
    isReady: false,
    fine: false,
    image: null,
    licenseImage: null,
    selectedValue: 0,
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
    if (this.state.OCRresult === null) {
      this._getFines();

    }
  }


  render() {
    if (!this.state.isReady) {
      return (
        <View style={GlobalStyle.container}>
          <ActivityIndicator size="large" color={Colors.tintColor} />
        </View>
      );
    }
    const ocrArr = this.state.OCRresult
    return (
      <View style={GlobalStyle.container}>
        <Animatable.Image animation="rotate" duration={2000} iterationCount={5} iterationDelay={1000} source={require("../assets/images/MokhalfatiLOGO.png")} style={{ height: 100, width: 100 }} />


        {(this.state.fine && !this.state.hasOptions) ? (
          <ScrollView>
            <View style={{ alignItems: "center" }}>
              <Image source={{ uri: this.state.image }} style={styles.image} />
              <Text style={{ fontWeight: "bold", margin: 5, fontSize: 20 }}>Your Car license plate ID is {this.state.firstLetter} {this.state.secondLetter} {this.state.thirdLetter} {this.state.digits}</Text>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5 }}>You have to pay {this.state.fine} EGP {"\n"} </Text>
              <Text style={{ fontWeight: "bold", color: "#ff0000" }}> Need more Details ? {"\n"} </Text>
              <Text style={{ fontSize: 16 }}>Pick car owner driving license image from:</Text>
              <View style={GlobalStyle.flexRow}>
                <Button title="Gallery" onPress={this._pickImageFromGallery} />
                <Text style={styles.text}> OR </Text>
                <Button title="Camera" onPress={this._pickImageFromCameraRoll} />
              </View>
            </View>
          </ScrollView>
        ) : null}


        {(!this.state.fine && !this.state.hasOptions) ? (
          <View style={{ alignItems: "center" }}>
            <Image source={{ uri: this.state.image }} style={styles.image} />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}> Nice!, You are a committed driver{"\n"}</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#ff0000" }}>You don't have to pay a penny</Text>
          </View>
        ) : null}

        {(this.state.hasOptions) ? (
          <View style={{ alignItems: "center" }}>
            <Image source={{ uri: this.state.image }} style={styles.image} />
            <Text>Help Us by choosing the correct ID</Text>
            <Picker style={{ height: 200, width: 300 }} selectedValue={this.state.selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({
                  selectedValue: itemValue,

                })}>
              {ocrArr.map((element, i) =>
                <Picker.Item label={element.firstLetter + element.secondLetter + element.thirdLetter + element.digits} value={i} key={i} />
              )}
            </Picker>
            <Button title="Proceed" onPress={this._proceed} />
          </View>

        ) : null}







      </View>
    );
  }

  _proceed = async () => {
    const index = this.state.selectedValue
    console.log(index)
    const userPreference = {
      firstLetter: this.state.OCRresult[index].firstLetter,
      secondLetter: this.state.OCRresult[index].secondLetter,
      thirdLetter: this.state.OCRresult[index].thirdLetter,
      digits: this.state.OCRresult[index].digits,
    }
    console.log(userPreference)
    const fine = await getFines(userPreference)
    console.log(fine)
    this.setState({ fine: fine, hasOptions: false, image: this.props.navigation.getParam("image") })
    this.forceUpdate()

  }
  _getFines = async () => {
    // Send the image to be processed
    const carLicenseData = await getCarLicenseData(this.props.navigation.getParam("image64"))
    // Get fines from the traffic fines api
    const carLicense = {
      // takes array instead of single results
      type: PLATE_FORMAT.ALPHA_NUMERIC,
      firstLetter: carLicenseData[0].firstLetter,
      secondLetter: carLicenseData[0].secondLetter,
      thirdLetter: carLicenseData[0].thirdLetter,
      digits: carLicenseData[0].digits
    }

    if (carLicenseData.length === 1) {
      const fine = await getFines(carLicense)
      this.setState({
        hasOptions: false,
        isReady: true,
        firstLetter: carLicenseData[0].firstLetter,
        secondLetter: carLicenseData[0].secondLetter,
        thirdLetter: carLicenseData[0].thirdLetter,
        digits: carLicenseData[0].digits,
        fine: fine,
        image: this.props.navigation.getParam("image"),
      })
    }
    else {
      this.setState({
        fine: 0,
        hasOptions: true,
        isReady: true,
        OCRresult: carLicenseData,
        image: this.props.navigation.getParam("image"),
      });
    };
  }

  _pickImageFromGallery = async () => {
    const { statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true/*Platform.OS !== 'ios'*/, base64: true });

    if (!result.cancelled) {
      this.setState({ licenseImage: result.uri, image64: result.base64 });
    }
  };
  _pickImageFromCameraRoll = async () => {
    const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
    const { statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: Platform.OS !== 'ios', base64: true });
    if (!result.cancelled) {
      this.setState({ licenseImage: result.uri, image64: result.base64 });
    }
  };

}

const styles = StyleSheet.create({
  image: {
    width: Constants.window.width,
    height: 300,
    resizeMode: "contain",
  },
  text: {
    marginTop: 11,
    fontWeight: "bold"
  }
});
