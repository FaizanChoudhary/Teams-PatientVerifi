import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  LogBox,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import IncodeSdk from 'react-native-incode-sdk';
import PushNotification from 'react-native-push-notification';
import Snackbar from 'react-native-snackbar';

//Redux
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

// import ZoomUs from 'react-native-zoom-us';

import {
  isAudioAuthenticate,
  isIncodeAuthenticate,
  isIncodeManual,
  isLoaderEnable,
  isUserLoggedIn,
  userDetail,
} from './src/redux/auth/selectors';
import {persistor, store} from './src/redux/stores/configureStore';

//Screens
import {logout} from './src/redux/auth/actions';
import Login from './src/screens/Login';
import ThankYou from './src/screens/ThankYou';
// import WebViewScreen from './src/screens/WebView';
// import MeetingScreen from './src/screens/MeetingScreen';
import RNAzureCommunicationUICalling from './native/RNAzureCommunicationUICalling';
import TopTabView from './src/navigation/TopTabView';
import {
  getCustomerData,
  getTeamsData,
  selfieVerificationApi,
  updateMeetingStatus,
} from './src/redux/auth/apis';
import AppointmentDetails from './src/screens/AppointmentDetails';
import AudioVerification from './src/screens/AudioVerification';
import CustomerSupport from './src/screens/CustomerSupport';
import IncodeOnboarding from './src/screens/IncodeOnboarding';
import ManualUser from './src/screens/ManualUser';
import TeamsMeetingScreen from './src/screens/TeamsMeetingScreen';
import TermsAndCondition from './src/screens/TermsAndCondition';
import UserAlreadyExist from './src/screens/UserAlreadyExist';
import VoiceScreen from './src/screens/VoiceScreen';
import {apiKey, apiUrl} from './src/utils/incodeCredentials';
// import MeetingScreen from './src/screens/MeetingScreen';

const Stack = createNativeStackNavigator();

const AppContainer = () => {
  LogBox.ignoreLogs(['new NativeEventEmitter']);
  const [showLogin, setShowLogin] = useState(false);
  const userInfo = userDetail();
  const loader = isLoaderEnable();
  const accessToken = isUserLoggedIn();
  const incodeManualUser = isIncodeManual();
  const audioAuthenticate = isAudioAuthenticate();
  const incodeAuthenticate = isIncodeAuthenticate();

  const meetingInfo = useSelector(state => state.auth?.meetingData);

  const showNotification = message => {
    console.log('============= message =============');
    console.log(message);
    console.log('====================================');
    Alert.alert(message?.notification?.title, message?.notification?.body, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          customerVerification(
            message?.data?.uuid,
            message?.data?.meetingId,
            message?.data?.password,
            message?.data,
          ),
      },
    ]);
  };

  const joinMeeting = async (meetingId, password, userDetails) => {
    try {
      const teamsData = await getTeamsData();
      if (!teamsData) {
        return null;
      }
      await RNAzureCommunicationUICalling.startCallComposite(
        // local options
        {
          displayName: meetingInfo?.userName,
          title: meetingInfo?.title,
          subtitle: meetingInfo?.meetingDescription,
        },
        null,
        // remote options
        {token: teamsData.token, meeting: meetingInfo?.joinUrl},
        null,
        // localization options
        {locale: 'en', layout: false},
      );
    } catch (e) {
      Alert.alert('Error', e.message, [{text: 'Dismiss'}]);
      console.error('ERR', e);
    }
  };

  const customerVerification = async (
    uuid,
    meetingId,
    password,
    userDetails,
  ) => {
    // await updateMeetingStatus(meetingId, userDetails?.id, 'left');
    await RNAzureCommunicationUICalling.dismiss();
    await IncodeSdk.initialize({
      testMode: false,
      apiConfig: {
        url: apiUrl,
        key: apiKey,
      },
    });
    console.log('customerVerification uuid', uuid);
    // ZoomUs.leaveMeeting();
    IncodeSdk.startFaceLogin({
      showTutorials: true,
      faceMaskCheck: false, // Specify true if you would like to prevent login for users that wear face mask
      customerUUID: uuid,
    })
      .then(async faceLoginResult => {
        if (faceLoginResult) {
          selfieVerificationApi(faceLoginResult, meetingId);
        }
      })
      .catch(e => {
        console.log('catch error =>', e, uuid);
        Snackbar.show({
          text: 'Error while calculating face recognition/liveness confidence',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#575DFB',
        });
      })
      .finally(() => {
        joinMeeting(meetingId, password, userDetails);
      });
  };

  useEffect(() => {
    messaging().onMessage(message => {
      if (Platform.OS === 'ios') {
        showNotification(message);
      }
    });

    PushNotification.configure({
      onRegister: function (token) {
        console.log('PushNotification TOKEN:', token);
        PushNotification.createChannel(
          {
            channelId: 'fcm_fallback_notification_channel',
            channelName: 'fcm_fallback_notification_channel',
          },
          created => console.log(`createChannel returned '${created}'`),
        );
      },

      onNotification: function (notification) {
        if (
          notification.userInteraction &&
          notification.data?.uuid &&
          notification.data?.meetingId
        ) {
          customerVerification(
            notification.data?.uuid,
            notification.data?.meetingId,
            notification.data?.password,
            notification.data,
          );
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,

      requestPermissions: true,
    });
  }, []);

  useEffect(() => {
    socketConnection();
  }, []);

  const socketConnection = () => {
    const stagingSocketUrl = 'wss://dev-api.ringcenteral.verifinow.io';
    var ws = new WebSocket(stagingSocketUrl);

    ws.onopen = () => {
      console.log('Connected to the server');
    };
    ws.onerror = e => {
      console.log('OnError =>', e);
      ws.close();
    };
    ws.onmessage = e => {
      console.log('Listening', e.data);
      const data = JSON.parse(e.data);
      const userId = store.getState().auth?.customerInfo?.id;
      if (userId) {
        if (data?.data?.custmId == userId) {
          (async () => {
            await AsyncStorage.removeItem('userToken');
            store.dispatch(logout());
            Snackbar.show({
              text: 'You are unauthorized user. Please contact administrator.',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: '#575DFB',
            });
          })();
        }
      }
    };

    ws.onclose = e => {
      console.log('Disconnected. Check internet or server.', e);
      socketConnection();
    };
  };

  useEffect(() => {
    if (!userInfo && !loader) {
      setTimeout(() => {
        setShowLogin(true);
      }, 100);
    }
  }, [userInfo, loader]);

  useEffect(() => {
    // if (!userInfo) {
    (async () => {
      const localStorage = await AsyncStorage.getItem('userToken');
      const token = JSON.parse(localStorage);
      if (token) {
        await getCustomerData(token);
      }
    })();
    // }
  }, []);

  if (accessToken) {
    if (!incodeAuthenticate) {
      return (
        <>
          <Stack.Navigator initialRouteName="TermsAndCondition">
            <Stack.Screen
              name="TermsAndCondition"
              component={TermsAndCondition}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="IncodeOnboarding"
              component={IncodeOnboarding}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="ThankYou"
              component={ThankYou}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="UserAlreadyExist"
              component={UserAlreadyExist}
              options={{animationEnabled: false, headerShown: false}}
            />
          </Stack.Navigator>
        </>
      );
    } else if (incodeAuthenticate && incodeManualUser && !audioAuthenticate) {
      return (
        <>
          <Stack.Navigator initialRouteName="ManualUser">
            <Stack.Screen
              name="ManualUser"
              component={ManualUser}
              options={{animationEnabled: false, headerShown: false}}
            />
          </Stack.Navigator>
        </>
      );
    } else if (incodeAuthenticate && !incodeManualUser && !audioAuthenticate) {
      return (
        <>
          <Stack.Navigator initialRouteName="VoiceScreen">
            <Stack.Screen
              name="VoiceScreen"
              component={VoiceScreen}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="ThankYou"
              component={ThankYou}
              options={{animationEnabled: false, headerShown: false}}
            />
          </Stack.Navigator>
        </>
      );
    } else {
      return (
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="CustomerSupport"
              component={CustomerSupport}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="TopTabView"
              component={TopTabView}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="AppointmentDetails"
              component={AppointmentDetails}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="AudioVerification"
              component={AudioVerification}
              options={{animationEnabled: false, headerShown: false}}
            />
            <Stack.Screen
              name="WebViewScreen"
              component={TeamsMeetingScreen}
              // component={MeetingScreen}
              options={{animationEnabled: false, headerShown: false}}
            />
          </Stack.Navigator>
        </>
      );
    }
  } else {
    if (!userInfo && loader) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <ActivityIndicator size={45} color="#1b75bb" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Roboto-Bold',
              color: '#000',
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: 10,
            }}>
            Loading Please Wait...
          </Text>
        </View>
      );
    } else {
      if (showLogin) {
        return (
          <>
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{animationEnabled: false, headerShown: false}}
              />
            </Stack.Navigator>
          </>
        );
      }
    }
  }
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View>
            <Text>Loading...</Text>
          </View>
        }
        persistor={persistor}>
        <NavigationContainer>
          <AppContainer />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
