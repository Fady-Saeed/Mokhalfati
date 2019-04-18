import { createAppContainer, createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import FineScreen from '../screens/FineScreen';

export default createAppContainer(createStackNavigator({
  ImagePicker: HomeScreen,
  Fines: FineScreen,
}))