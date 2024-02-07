import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

import images from '../constants/images';
import Header from '../components/Header';

const AppointmentDetails = ({
  route: {
    params: {meet, joinMeeting},
  },
}) => {
  const navigation = useNavigation();
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, marginTop: 25}}>
        <View style={{flex: 1, marginHorizontal: 20}}>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontFamily: 'Roboto-Bold',
            }}>
            {meet?.meeting_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={images.man}
                resizeMode="contain"
                style={{
                  width: 85,
                  height: 85,
                  borderRadius: 85,
                  marginTop: 10,
                }}
              />
              <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    marginTop: 5,
                    fontFamily: 'Roboto-Medium',
                  }}>
                  {meet?.doctor?.name}
                </Text>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 12,
                    marginTop: 5,
                    fontFamily: 'Roboto-Light',
                  }}>
                  {meet?.doctor?.speciality?.speciality_name}
                </Text>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 12,
                    marginTop: 5,
                    fontFamily: 'Roboto-Light',
                  }}>
                  {meet?.doctor?.address_line_1}
                </Text>
              </View>
            </View>
            {joinMeeting && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#376FD0',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => navigation.navigate('AudioVerification')}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={images.join}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: '#fff',
                      marginLeft: 5,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 17,
                      textAlign: 'center',
                      fontFamily: 'Roboto-Regular',
                      marginHorizontal: 5,
                    }}>
                    Join
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: 'lightgray',
              marginVertical: 25,
            }}
          />
          <View>
            <Text
              style={{
                color: '#000',
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
              }}>
              Appointment
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontFamily: 'Roboto-Light',
                }}>
                Date:
              </Text>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontFamily: 'Roboto-Light',
                }}>
                {moment(meet.start_date).format('DD MMMM YYYY')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontFamily: 'Roboto-Light',
                }}>
                Time:
              </Text>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontFamily: 'Roboto-Light',
                }}>
                {moment(meet.start_time).format('hh:mm a')}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: 'lightgray',
              marginVertical: 25,
            }}
          />
          <Text
            style={{
              color: '#000',
              fontSize: 15,
              fontFamily: 'Roboto-Medium',
            }}>
            Reason For Visit
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 14,
              marginTop: 5,
              fontFamily: 'Roboto-Light',
            }}>
            {meet?.meeting_description}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppointmentDetails;
