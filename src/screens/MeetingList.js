import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';

import images from '../constants/images';
import {getMeetingList} from '../redux/auth/apis';
import {userDetail} from '../redux/auth/selectors';
import {useNavigation} from '@react-navigation/native';
import {store} from '../redux/stores/configureStore';
import {setMeetingData} from '../redux/auth/actions';

const MeetingList = () => {
  const [meetingList, setMeetingList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const user = userDetail();
  const navigation = useNavigation();

  const getMeetings = async () => {
    setRefreshing(true);
    const meetings = await getMeetingList('upcoming');
    // if (meetings?.length) {
    const sortArray = meetings.sort((a, b) => {
      return a.start_time - b.start_time;
    });
    setMeetingList(sortArray);
    // }
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => {
    getMeetings();
  }, []);

  useEffect(() => {
    getMeetings();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, marginTop: 15}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {refreshing ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={30} color="#575DFB" />
          </View>
        ) : meetingList.length ? (
          meetingList.map((meet, index) => {
            const meetingDetails = {
              meetingId: meet?.meeting_id,
              password: meet?.meeting_password,
              companyId: meet?.company_id,
              joinUrl: meet?.join_url,
              title: meet?.meeting_name,
              meetingDescription: meet?.meeting_description,
              userName: user?.name,
              userId: user?.id,
            };
            return (
              <TouchableOpacity
                onPress={() => {
                  store.dispatch(setMeetingData(meetingDetails));
                  navigation.navigate('AppointmentDetails', {
                    meet,
                    joinMeeting: true,
                  });
                }}
                style={{
                  elevation: 6,
                  margin: 15,
                  marginHorizontal: 20,
                  marginTop: 15,
                  marginBottom: meetingList[meetingList.length - 1] ? 30 : 0,
                }}
                key={index}>
                <View
                  style={{
                    marginTop: 5,
                    padding: 15,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: '#000',
                        fontSize: 16,
                        maxWidth: '80%',
                        marginLeft: 5,
                        marginBottom: 2,
                        textAlign: 'justify',
                        fontFamily: 'Roboto-Medium',
                      }}>
                      {meet.meeting_name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        store.dispatch(setMeetingData(meetingDetails));
                        navigation.navigate('AudioVerification');
                      }}>
                      <View
                        style={{
                          backgroundColor: '#376FD0',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 5,
                          borderRadius: 5,
                        }}>
                        <Image
                          source={images.join}
                          style={{
                            width: 15,
                            height: 15,
                            tintColor: '#fff',
                            marginLeft: 5,
                          }}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            textAlign: 'center',
                            fontFamily: 'Roboto-Regular',
                            marginHorizontal: 5,
                          }}>
                          Join
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={images.timer}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: '#000',
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 12,
                        marginLeft: 5,
                        fontFamily: 'Roboto-Light',
                      }}>
                      {moment(meet.start_date).format('DD MMM')} - {''}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 12,
                        fontFamily: 'Roboto-Light',
                      }}>
                      {moment(meet.start_time).format('hh:mm a')}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: 'lightgray',
                      marginVertical: 10,
                      marginHorizontal: 5,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 35,
                        width: 35,
                        borderRadius: 35,
                        marginLeft: index > 0 ? 10 : 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          meet?.doctor?.pic_url
                            ? {uri: meet.doctor.pic_url}
                            : images.man
                        }
                        style={{width: 35, height: 35}}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{marginLeft: 10}}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 13,
                          fontFamily: 'Roboto-Medium',
                        }}>
                        {meet?.doctor?.name}
                      </Text>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 12,
                          fontFamily: 'Roboto-Light',
                        }}>
                        {meet?.doctor?.speciality?.speciality_name}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 25,
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: 18,
                textAlign: 'center',
                fontFamily: 'Roboto-Regular',
              }}>
              You don't have any upcoming appointments at this time.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MeetingList;
