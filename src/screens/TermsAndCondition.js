import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import images from '../constants/images';
import Header from '../components/Header';
import Button from '../components/Button';

const TermsAndCondition = () => {
  const [termsToggle, setTermsToggle] = useState(false);

  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F5F5F5',
      }}>
      <Header />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexGrow: 1,
            marginHorizontal: 20,
            marginTop: StatusBar.currentHeight + 80,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
              color: '#000',
              textAlign: 'center',
            }}>
            Terms and condition
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Light',
              color: '#000',
              alignSelf: 'center',
              textAlign: 'justify',
              marginTop: 50,
            }}>
            By using the PatientVerifi mobile app, you agree to the following
            terms and conditions. PatientVerifi is provided on an "as-is" and
            "as-available" basis, without warranties of any kind. We reserve the
            right to modify, suspend, or discontinue the app at any time without
            notice. PatientVerifi is intended for use as an identity
            verification solution and should not be used for any unlawful
            purposes. You are responsible for complying with all applicable laws
            and regulations. The PatientVerifi app uses various technologies,
            including voice biometrics and liveness detection, to verify your
            identity. By using the app, you consent to the collection, use, and
            processing of your personal information and voiceprints for this
            purpose. We take the security and privacy of your personal
            information seriously and use industry-standard security measures to
            protect it. However, we cannot guarantee the security of your data
            and are not responsible for any unauthorized access, disclosure, or
            loss of data. By using the PatientVerifi mobile app, you agree to
            indemnify and hold us harmless from any claims, damages, or
            liabilities arising from your use of the app or your violation of
            these terms and conditions. We may update these terms and conditions
            at any time, and your continued use of the PatientVerifi app after
            any changes will constitute your acceptance of the updated terms. If
            you do not agree to these terms and conditions, please do not use
            the PatientVerifi app.
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setTermsToggle(!termsToggle)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 32,
              marginLeft: 20,
            }}>
            {termsToggle ? (
              <Image
                source={images.checked}
                resizeMode="contain"
                style={{width: 30, height: 30, tintColor: '#1b75bb'}}
              />
            ) : (
              <Image
                source={images.unChecked}
                resizeMode="contain"
                style={{width: 30, height: 30, tintColor: '#1b75bb'}}
              />
            )}
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto-Light',
                color: '#000',
                marginLeft: 5,
                marginBottom: 3,
              }}>
              Agree the terms of this service
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'flex-end',
              marginVertical: 35,
            }}>
            <Button
              title="Next"
              disable={!termsToggle ? true : false}
              onClick={() => {
                setTermsToggle(false);
                navigation.navigate('IncodeOnboarding');
              }}
              style={{
                backgroundColor: '#1b75bb',
                opacity: !termsToggle ? 0.5 : 1,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndCondition;
