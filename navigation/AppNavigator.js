import { createAppContainer, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import FineScreen from '../screens/FineScreen';
import DetailsScreen from '../screens/DetailsScreen';

export default createAppContainer(createStackNavigator({
  ImagePicker: HomeScreen,
  Fines: FineScreen,
  Details: DetailsScreen,
}))