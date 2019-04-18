import { StyleSheet } from 'react-native'
import Constants from '../constants/Layout'

export default StyleSheet.create({
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
    },
    textBold: {
        fontWeight: '500'
    }
  });
  