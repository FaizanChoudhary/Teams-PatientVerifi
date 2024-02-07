import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import RNAzureCommunicationUICalling from '../../native/RNAzureCommunicationUICalling';
import images from '../constants/images';
import {getTeamsData} from '../redux/auth/apis';

const TeamsMeetingScreen = () => {
  const [loader, setLoader] = useState(true);
  const navigation = useNavigation();
  const meetingInfo = useSelector(state => state.auth?.meetingData);

  const startCallComposite = useCallback(async () => {
    // if (Platform.OS === 'ios') {
    //   const themeColor = PlatformColor('systemTeal'); // set null for default theme color
    //   RNAzureCommunicationUICalling.setThemeColor(themeColor);
    // }
    try {
      setLoader(true);
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
    } finally {
      setTimeout(() => setLoader(false), 2000);
    }
  }, [meetingInfo]);

  useEffect(() => {
    startCallComposite();
  }, [startCallComposite]);

  return (
    !loader && (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F8F8F8'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop:
              StatusBar.currentHeight + Platform.OS == 'android' ? 15 : 50,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TopTabView')}
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
            Meeting Ended
          </Text>
        </View>
        <View
          style={{
            marginTop: 250,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            source={images.logo}
            style={{
              width: 288,
              height: 88,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              fontSize: 16,
              color: '#000',
              fontFamily: 'Roboto-Light',
            }}>
            You've left the appointment. Thanks!
          </Text>
        </View>
      </SafeAreaView>
    )
  );
};

export default TeamsMeetingScreen;
