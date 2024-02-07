import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import images from '../constants/images';

const Button = ({
  title,
  style,
  textStyle,
  onClick,
  icon,
  tintColor,
  loading,
  disable,
  buttonIcon,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onClick}
      disabled={disable}
      style={[
        {
          backgroundColor: '#0f75bc',
          alignItems: 'center',
          height: 56,
          justifyContent: 'center',
          borderRadius: 16,
          flexDirection: 'row',
        },
        style,
      ]}>
      {icon && !loading && (
        <Image
          resizeMode="contain"
          source={images.video}
          style={[
            {width: 24, height: 24, marginRight: 10},
            {tintColor: tintColor},
          ]}
        />
      )}
      {buttonIcon && !loading && (
        <Image
          resizeMode="contain"
          source={buttonIcon}
          style={[
            {width: 18, height: 18, marginRight: 7},
            {tintColor: tintColor},
          ]}
        />
      )}
      {loading ? (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="small" color={'#fff'} />
        </View>
      ) : (
        <Text
          style={[
            {
              fontSize: 16,
              fontFamily: 'Roboto-Medium',
              color: '#fff',
            },
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
