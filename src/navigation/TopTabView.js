import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import images from '../constants/images';
import Header from '../components/Header';
import MeetingList from '../screens/MeetingList';
import History from '../screens/History';

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#F5F5F5'}]} />
);
const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#F5F5F5'}]} />
);

const ThirdRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#F5F5F5'}]} />
);

const TopTabView = () => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'first', title: 'Upcoming'},
    {key: 'second', title: 'Past'},
  ]);

  const navigation = useNavigation();

  const RenderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#0263E0'}}
      style={{
        backgroundColor: '#F5F5F5',
      }}
      pressColor="#F5F5F5"
      activeColor="#0263E0"
      inactiveColor="#000"
      labelStyle={{
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        textTransform: 'capitalize',
      }}
    />
  );

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Header />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:
            StatusBar.currentHeight + Platform.OS == 'android' ? 15 : 50,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            left: 25,
            width: 30,
            height: 30,
            position: 'absolute',
            justifyContent: 'center',
          }}>
          <Image
            source={images.back}
            style={{
              width: 15,
              height: 15,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#000',
            fontSize: 20,
            marginLeft: 5,
            fontFamily: 'Roboto-Bold',
          }}>
          Appointments
        </Text>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderTabBar={RenderTabBar}
        renderScene={SceneMap({
          first: MeetingList,
          second: History,
        })}
        onIndexChange={index => setIndex(index)}
        initialLayout={{width: Dimensions.get('window').width}}
        style={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  scene: {
    flex: 1,
  },
});

export default TopTabView;
