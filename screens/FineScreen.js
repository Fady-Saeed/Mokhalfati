import React from "react";
import { ActivityIndicator, StyleSheet, View, Image, Text } from "react-native";
import Colors from "../constants/Colors";
import Constants from "../constants/Layout";
import GlobalStyle from "../constants/GlobalStyles";
import { MonoText } from "../components/StyledText";

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
        {this.state.fine && (
          <View style={GlobalStyle.flexRow}>
            <Text style={GlobalStyle.textBold}>You have to pay </Text>
            <Text>{this.state.fine} EGP</Text>
          </View>
        )}
        {!this.state.fine && (
          <View style={GlobalStyle.flexRow}>
            <Text style={GlobalStyle.textBold}>
              You don't have to pay a penny
            </Text>
          </View>
        )}
      </View>
    );
  }
  _getFines = async () => {
    // Send the image to be processed
    // Change the screen to the results screen
    this.setState({
      isReady: true,
      image: this.props.navigation.getParam("image")
    });
  };
}

const styles = StyleSheet.create({
  image: {
    width: Constants.window.width * 0.9,
    height: 300
  }
});
