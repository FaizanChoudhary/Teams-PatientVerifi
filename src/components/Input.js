import React from 'react';
import {View, Text, TextInput, Image} from 'react-native';

import images from '../constants/images';

const Input = ({label, placeholder}) => {
  return (
    <View style={{marginHorizontal: 20}}>
      <Text style={{fontSize: 16, fontFamily: 'Roboto-Regular', color: '#000'}}>
        {label}
      </Text>
      <View
        style={{
          height: 56,
          borderColor: '#000',
          borderWidth: 1.5,
          borderRadius: 16,
          marginTop: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          resizeMode="contain"
          source={images.name}
          style={{width: 16, height: 18, tintColor: '#000', marginLeft: 20}}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#C8C8C8"
          style={{
            flexGrow: 1,
            padding: 0,
            marginHorizontal: 15,
            fontFamily: 'Roboto-Regular',
            fontSize: 16,
          }}
        />
      </View>
    </View>
  );
};

export default Input;
