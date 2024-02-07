import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Text, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import IncodeSdk from 'react-native-incode-sdk';
import Snackbar from 'react-native-snackbar';

import {
  setSelfieInfo,
  setBackIDInfo,
  setFrontIDInfo,
  setCustomerUUID,
  setCustomerToken,
  setCustomerInterviewId,
  faceMatchInfo,
  // userExist,
} from '../redux/auth/actions';
import {storeIncodeInfoApi, userScoreStatus} from '../redux/auth/apis';
import {apiConfigFlowID, apiKey, apiUrl} from '../utils/incodeCredentials';
import {isIncodeAuthenticate, isUserLoggedIn} from '../redux/auth/selectors';
import {SERVER_NAME} from '../utils/baseUrl';

const IncodeOnboarding = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const accessToken = isUserLoggedIn();
  const incodeAuthenticate = isIncodeAuthenticate();
  const loader = useSelector(state => state.auth?.loader);
  // const isUserExist = useSelector(state => state.auth?.userExist);
  const userId = useSelector(state => state.auth?.customerInfo?.id.toString());

  const [showLoading, setShowLoading] = useState(true);

  const storeIncodeData = (status, reason, extraDetail) => {
    storeIncodeInfoApi(accessToken, status, reason, extraDetail);
  };

  useEffect(() => {
    if (!incodeAuthenticate) {
      // if (!isUserExist) {
      initializeAndRunOnboarding();
      // } else {
      //   navigation.reset({
      //     index: 0,
      //     routes: [{name: 'UserAlreadyExist'}],
      //   });
      // }
    }
  }, [incodeAuthenticate]);

  const initializeAndRunOnboarding = () => {
    IncodeSdk.initialize({
      testMode: false,
      apiConfig: {
        key: apiKey,
        url: apiUrl,
      },
    })
      .then(_ => {
        startOnboarding();
      })
      .catch(e => console.error('Incode SDK failed init', e));
  };

  const startOnboarding = () => {
    const jsonTheme = JSON.stringify({
      buttons: {
        primary: {
          states: {
            normal: {
              backgroundColor: '#1b75bb',
            },
            highlighted: {
              backgroundColor: '#1b75bb',
            },
          },
        },
      },
    });

    IncodeSdk.setTheme({jsonTheme: jsonTheme});

    IncodeSdk.startOnboarding({
      flowConfig: [
        {module: 'IdScan'},
        {module: 'SelfieScan', lensesCheck: false},
        {module: 'FaceMatch'},
        {module: 'Approve'},
      ],
      sessionConfig: {
        configurationId: apiConfigFlowID,
        externalId: `${SERVER_NAME}-${userId}-${new Date().getTime()}`,
      },
    })
      .then(result => {
        if (result.status === 'userCancelled') {
          navigation.navigate('TermsAndCondition');
        }
      })
      .catch(error => {
        console.log('onBoardingError =>', error);
        navigation.navigate('TermsAndCondition');
        Snackbar.show({
          text: 'Something went wrong, Please try again',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#575DFB',
        });
      });
  };

  useEffect(() => {
    const unsubscribers = setupListeners();
    return () => {
      unsubscribers.forEach(unsubscriber => unsubscriber());
    };
  }, []);

  const setupListeners = () => {
    IncodeSdk.onSessionCreated(session => {
      console.log('session created =>', session.interviewId);
      setShowLoading(false);
      dispatch(setCustomerToken(session.token));
      dispatch(setCustomerInterviewId(session.interviewId));
    });

    const complete = IncodeSdk.onStepCompleted;
    return [
      complete({
        module: 'IdScanFront',
        listener: e => {
          dispatch(setFrontIDInfo(e.result));
          console.log('ID scan front:', e.result);
        },
      }),
      complete({
        module: 'IdScanBack',
        listener: e => {
          dispatch(setBackIDInfo(e.result));
          console.log('ID scan back: ', e.result);
        },
      }),
      complete({
        module: 'ProcessId',
        listener: e => {
          console.log('ProcessId result: ', e.result.extendedOcrData);
        },
      }),
      complete({
        module: 'SelfieScan',
        listener: e => {
          dispatch(setSelfieInfo(e.result));
          console.log('SelfieScan result: ', e.result);
        },
      }),

      complete({
        module: 'FaceMatch',
        listener: e => {
          dispatch(faceMatchInfo(e.result));
          console.log('Face match complete', e.result);
          if (e.result.existingUser) {
            Snackbar.show({
              text: 'User Already Exist',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: '#575DFB',
            });
            // IncodeSdk.finishOnboardingFlow();
            // dispatch(userExist(true));
          }
        },
      }),
      complete({
        module: 'Approve',
        listener: async e => {
          console.log('Approve Info=>', e);
          if (e.result.id) {
            const response = await userScoreStatus();
            console.log('userScoreStatus', response);
            if (response?.session_status === 'OK') {
              dispatch(setCustomerUUID(e.result.id));
              storeIncodeData(
                'success',
                response?.reason,
                response?.extra_details,
              );
              IncodeSdk.finishOnboardingFlow();
            }
          } else {
            const response = await userScoreStatus();
            console.log('userScoreStatus MANUAL', response);
            if (response?.session_status === 'MANUAL') {
              storeIncodeData('MANUAL', response?.reason);
            } else if (response?.session_status === 'FAIL') {
              storeIncodeData(
                'FAIL',
                response?.reason,
                response?.extra_details,
              );
              setShowLoading(true);
              startOnboarding();
            } else {
              Snackbar.show({
                text: 'Invalid Information, Please Try Again',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#575DFB',
              });
              setShowLoading(true);
              startOnboarding();
            }
          }
        },
      }),
    ];
  };

  if (showLoading || loader) {
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
  }
};

export default IncodeOnboarding;
