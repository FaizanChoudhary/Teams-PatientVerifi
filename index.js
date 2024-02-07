/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {appNameAndroid, appNameIOS} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('App background');
});

if (Platform.OS === 'ios') {
  AppRegistry.registerComponent(appNameIOS, () => App);
} else {
  AppRegistry.registerComponent(appNameAndroid, () => App);
}
