import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Image,
  LogBox,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../components/Button';
import Header from '../components/Header';
import LogoutModal from '../components/LogoutModal';
import images from '../constants/images';
import { setImageUrls } from '../redux/auth/actions';
import { getCustomerHistory } from '../redux/auth/apis';
import { SERVER_URL } from '../utils/baseUrl';

const CustomerSupport = () => {
  const [showLoading, setShowLoading] = useState(false);

  const modalRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.auth?.customerInfo);
  const customerHistory = useSelector(state => state.auth?.verificationHistory);
  const imageUrls = useSelector(state => state.auth?.imageUrls);

  useEffect(() => {
    const subscription =AppState.addEventListener('change', handleChange);

    LogBox.ignoreAllLogs();
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        setShowLoading(true);
        await getCustomerHistory(userInfo?.id);
        setShowLoading(false);
      })();
    });
    return () => {
      unsubscribe;
      subscription.remove();
    };
  }, [userInfo, navigation]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          SERVER_URL + `/get-company-branding/${userInfo?.id}`,
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
          },
        );
        const {data} = await response.json();
        if (data) {
          dispatch(setImageUrls(data?.logo_url, data?.watermark_url));
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }
    })();
  }, []);

  const handleChange = async newState => {
    if (newState === 'active') {
      setShowLoading(true);
      await getCustomerHistory(userInfo?.id);
      setShowLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Header />
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => modalRef.current.getAlert()}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
          }}>
          <Image source={images.logout} style={{width: 23, height: 23}} />
        </TouchableOpacity>
        <LogoutModal ref={modalRef} />
        <View
          style={{
            marginHorizontal: 20,
            marginTop: StatusBar.currentHeight + 70,
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            source={{uri: imageUrls?.logo}}
            style={{width: 188, height: 68}}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
              color: '#000',
              marginTop: 18,
            }}>
            {userInfo?.name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Light',
              color: '#000',
              marginVertical: 40,
              marginHorizontal: 40,
              textAlign: 'left',
            }}>
            You will receive notifications from your healthcare provider to
            verify yourself with a selfie during tele-health appointments.
          </Text>
        </View>
        <Button
          icon={true}
          title="Tele-health Appointments"
          tintColor="#fff"
          textStyle={{color: '#fff'}}
          onClick={() => navigation.navigate('TopTabView')}
          style={{
            borderWidth: 1,
            borderColor: '#B4B4B8',
            marginHorizontal: 45,
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Roboto-Medium',
            color: '#000',
            marginLeft: 20,
            marginTop: 50,
            marginBottom: 20,
          }}>
          Verification Logs
        </Text>

        {showLoading ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={30} color="#575DFB" />
          </View>
        ) : !showLoading && customerHistory?.length ? (
          <FlatList
            nestedScrollEnabled
            style={{maxHeight: 500}}
            data={customerHistory}
            keyExtractor={(_, index) => index}
            renderItem={(info, index) => {
              const calenderDate = moment(info?.item?.created_at).format(
                'MM/DD/YYYY',
              );
              const time = moment(info?.item?.created_at).format('h:mm a');
              return (
                <View
                  key={index}
                  style={{
                    flexGrow: 1,
                    marginHorizontal: 20,
                  }}>
                  <View style={{marginTop: 20}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Light',
                        color: '#000',
                      }}>
                      Time : {time}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Light',
                        color: '#000',
                        marginTop: 5,
                      }}>
                      Date : {calenderDate}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Light',
                        color: '#000',
                        marginTop: 5,
                      }}>
                      {info?.item?.type === 'SELFIE_VERIFICATION'
                        ? 'SELFIE VERIFICATION'
                        : 'VOICE VERIFICATION'}{' '}
                      {info?.item?.status == '0' ? 'FAILED' : 'PASSED'}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#757575',
                      marginTop: 25,
                    }}
                  />
                </View>
              );
            }}
          />
        ) : (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto-Light',
                color: '#000',
                marginVertical: 5,
                alignSelf: 'center',
              }}>
              No Verification Logs Found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomerSupport;
