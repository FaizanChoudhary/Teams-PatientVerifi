import React, {useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

import images from '../constants/images';
import Header from '../components/Header';
import LogoutModal from '../components/LogoutModal';

const ManualUser = () => {
  const modalRef = useRef();

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Header />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => modalRef.current.getAlert()}
          style={{
            position: 'absolute',
            top: 50,
            right: 0,
          }}>
          <Image source={images.logout} style={{width: 23, height: 23}} />
        </TouchableOpacity>
        <LogoutModal ref={modalRef} />
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Roboto-Regular',
            color: '#000',
            textAlign: 'center',
          }}>
          Review Required
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Roboto-Light',
            color: '#000',
            textAlign: 'center',
            marginTop: 10,
            marginHorizontal: 20,
            lineHeight: 20
          }}>
          Thank you for onboarding with us. Your onboarding completion requires
          review by administrator. Please contact administrator for further
          details.
        </Text>
      </View>
    </View>
  );
};

export default ManualUser;
