import React from 'react';
import {View, Text, StatusBar, ScrollView} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import Header from '../components/Header';
import Button from '../components/Button';
import {audioOnBoard, inCodeOnBoard} from '../redux/auth/actions';

const ThankYou = route => {
  const dispatch = useDispatch();

  const userInfo = useSelector(state => state.auth?.customerInfo);

  const audioResponse = route?.route?.params?.response;

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Header />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexGrow: 1,
            marginHorizontal: 20,
            marginTop: StatusBar.currentHeight + 70,
          }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: 'Roboto-Light',
              color: '#000',
            }}>
            Thank You
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
              color: '#000',
              marginTop: 10,
            }}>
            {userInfo?.name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Light',
              color: '#000',
              marginTop: 40,
            }}>
            Your ID has been verified and you can start using our service.
          </Text>
          <View style={{flexGrow: 1, justifyContent: 'center', marginTop: 30}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto-Light',
                color: '#000',
                alignSelf: 'center',
                textAlign: 'justify',
              }}>
              By using the PatientVerifi-Zoom mobile app, you agree to the
              following terms and conditions. PatientVerifi-Zoom is provided on
              an "as-is" and "as-available" basis, without warranties of any
              kind. We reserve the right to modify, suspend, or discontinue the
              app at any time without notice. PatientVerifi-Zoom is intended for
              use as an identity verification solution and should not be used
              for any unlawful purposes. You are responsible for complying with
              all applicable laws and regulations. The PatientVerifi-Zoom app
              uses various technologies, including voice biometrics and liveness
              detection, to verify your identity. By using the app, you consent
              to the collection, use, and processing of your personal
              information and voiceprints for this purpose. We take the security
              and privacy of your personal information seriously and use
              industry-standard security measures to protect it. However, we
              cannot guarantee the security of your data and are not responsible
              for any unauthorized access, disclosure, or loss of data. By using
              the PatientVerifi-Zoom mobile app, you agree to indemnify and hold
              us harmless from any claims, damages, or liabilities arising from
              your use of the app or your violation of these terms and
              conditions. We may update these terms and conditions at any time,
              and your continued use of the PatientVerifi-Zoom app after any
              changes will constitute your acceptance of the updated terms. If
              you do not agree to these terms and conditions, please do not use
              the PatientVerifi-Zoom app.
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-end', marginVertical: 40}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Button
                onClick={() => dispatch(audioOnBoard(audioResponse))}
                title="Agree"
                style={{width: '45%', backgroundColor: '#4CD964'}}
              />
              <Button
                onClick={() => {
                  dispatch(inCodeOnBoard(null));
                }}
                title="Disagree"
                style={{
                  width: '45%',
                  backgroundColor: '#F5F5F5',
                  borderWidth: 1.5,
                  borderColor: 'rgba(0, 0, 0, 0.4)',
                }}
                textStyle={{color: '#000'}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ThankYou;
