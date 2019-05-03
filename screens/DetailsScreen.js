import React from "react";
import { ActivityIndicator, StyleSheet, ScrollView, View, Image, Text } from "react-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Colors from "../constants/Colors";
import Constants from "../constants/Layout";
import GlobalStyle from "../constants/GlobalStyles";
import { MonoText } from "../components/StyledText";
import { PLATE_FORMAT, getFines } from "../api/fines"
import { getDriverLicenseData } from "../api/driverLicenseDataExtractor"

export default class DetailsScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    tableHeaders = ["Title", "Location", "Date", "Amount"]
    state = {
        isReady: false,
        fine: -1,
        image: null,
        fineDetails: {
            totalWithoutTaxes: "245",
            taxes: "1.5",
            detailedList: [
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
                ["Parking wrongly", "Cairo", "21/2/2019", "245"],
            ]
        }
    };
    componentDidMount() {
        this._getDetailedFines();
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
                <Image source={require("../assets/images/MokhalfatiLOGO.png")} style={{ height: 100, width: 100 }} />

                {(!(this.state.fineDetails.detailedList.length === 0)) ? (
                    <ScrollView>
                        <Image source={{ uri: this.state.image }} style={styles.image} />
                        <Text style={{ justifyContent: "center", textAlign: "center", fontWeight: "bold/" }}>You have to pay {this.state.fineDetails.totalWithoutTaxes} EGP in addition to taxes of {this.state.fineDetails.taxes} EGP </Text>
                        <View style={styles.container}>
                            <Table borderStyle={{ borderWidth: 4, borderColor: '#c8e1ff' }}>
                                <Row data={this.tableHeaders} style={styles.head} textStyle={styles.headerText} />
                                <Rows data={this.state.fineDetails.detailedList} textStyle={styles.text} />
                            </Table>

                        </View>
                    </ScrollView>
                ) : null}


                {(this.state.fineDetails.detailedList.length === 0) ? (
                    <View style={GlobalStyle.flexRow}>
                        <Image source={{ uri: this.state.image }} style={styles.image} />
                        <Text style={GlobalStyle.textBold}>You don't have to pay a penny</Text>
                    </View>
                ) : null}
            </View>
        );
    }
    _getDetailedFines = async () => {
        // Send the image to be processed
        const driverLicenseData = await getDriverLicenseData(this.props.navigation.getParam("image64"))
        // Get driver ID 
        const driverLicense = {
            id: driverLicenseData.id,
        }
        const fine = await getFines(driverLicense)
        // Update the screen state
        this.setState({
            isReady: true,
            image: this.props.navigation.getParam("image"),
            fine: fine,
            //fineDetails: fineDetails
        });
    };
}

const styles = StyleSheet.create({
    image: {
        width: Constants.window.width,
        height: 300,
        resizeMode: "contain"
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff'
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },
    table_data: {
        height: 40,
        flex: 1,
        backgroundColor: '#ffffff'
    },
    text: { margin: 6 },
    headerText: { margin: 6, fontWeight: "bold" }
});
