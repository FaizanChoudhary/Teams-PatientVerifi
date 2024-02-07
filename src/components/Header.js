import React from 'react';
import {View, StatusBar} from 'react-native';

const Header = ({hidden, color='#F5F5F5'}) => {
  return (
    <View>
      <StatusBar
        translucent
        backgroundColor={color}
        barStyle="dark-content"
        hidden={hidden}
      />
    </View>
  );
};

export default Header;
