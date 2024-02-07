import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {useNavigation} from '@react-navigation/native';
import {check, request, PERMISSIONS} from 'react-native-permissions';

import images from '../constants/images';
import Header from '../components/Header';
import {SERVER_URL} from '../utils/baseUrl';
import {userDetail} from '../redux/auth/selectors';
import Button from '../components/Button';
import {useSelector} from 'react-redux';

const AudioVerification = () => {
  const user = userDetail();
  const navigation = useNavigation();
  const [recordState, setRecordState] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [verificationStatusLoading, setVerificationStatusLoading] =
    useState(true);

  const [audioFile, setAudioFile] = useState('');
  const imageUrls = useSelector(state => state.auth?.imageUrls);
  const meetingInfo = useSelector(state => state.auth?.meetingData);
  const meetingId = meetingInfo?.meetingId;

  const AUDIO_OPTIONS = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    wavFile: 'audioVerification.wav',
  };

  AudioRecord.init(AUDIO_OPTIONS);

  AudioRecord.on('data', data => {
    // const chunk = Buffer.from(data, 'base64');
    console.log('chunk size', data);
    // do something with audio chunk
  });

  const startRecordingFunc = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          AudioRecord.init(AUDIO_OPTIONS);
          AudioRecord.start();
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else {
      const result = await check(PERMISSIONS.IOS.MICROPHONE);
      if (result === 'granted') {
        AudioRecord.init(AUDIO_OPTIONS);
        AudioRecord.start();
      } else {
        request(PERMISSIONS.IOS.MICROPHONE).then(result => {
          console.log('result =>', result);
          if (result === 'granted') {
            AudioRecord.init(AUDIO_OPTIONS);
            AudioRecord.start();
          }
        });
      }
    }
  };

  const stopRecordingFunc = async () => {
    const audioPath = await AudioRecord.stop();
    console.log('audioPath', audioPath);
    setAudioFile(audioPath);
  };

  const uploadAudioVoice = async () => {
    try {
      setShowLoading(true);
      var formData = new FormData();
      formData.append('media_type', 'AUDIO_VERIFICATION');
      formData.append('file', {
        uri: `file:///${audioFile}`,
        type: 'audio/wav',
        name: 'audioVerification.wav',
      });
      formData.append('meeting_id', meetingId);

      const response = await fetch(
        `${SERVER_URL}/audio_verification/${user?.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );
      const resp = await response.json();
      console.log('resp =>', resp);
      if (resp?.data) {
        navigation.replace('WebViewScreen');
      } else if (
        resp?.errors[0]?.message ===
        'E_UNAUTHORIZED_ACCESS: Unauthorized access'
      ) {
        await AsyncStorage.removeItem('userToken');
        dispatch(logout());
        Snackbar.show({
          text: 'You are unauthorized user. Please contact administrator.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#575DFB',
        });
      } else {
        Snackbar.show({
          text: resp?.message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#575DFB',
        });
      }
    } catch (error) {
      console.log('error =>', error);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/userVerificationStatus/${user?.id}`,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              meeting_id: meetingId,
              type: 'AUDIO_VERIFICATION',
            }),
          },
        );
        const resp = await response.json();
        if (resp?.verification_status) {
          navigation.replace('WebViewScreen');
        } else {
          setVerificationStatusLoading(false);
        }
      } catch (error) {
        console.log('verification error', error);
        setVerificationStatusLoading(false);
      }
    })();
  }, [user, meetingId]);

  useEffect(() => {
    if (recordState)
      setTimeout(() => {
        setRecordState(false);
        stopRecordingFunc();
      }, 4000);
  }, [recordState]);

  if (verificationStatusLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#0263E0" />
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
        <Header />
        <View
          style={{
            flex: 1,
            marginHorizontal: 20,
          }}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
            showsVerticalScrollIndicator={false}>
            <Image
              source={{uri: imageUrls?.logo}}
              style={{height: 300, width: 300, marginTop: 20}}
              resizeMode="contain"
            />
            <Text
              style={{
                textAlign: 'center',
                marginTop: -40,
                marginHorizontal: 30,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  fontFamily: 'Roboto-Regular',
                }}>
                "
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'purple',
                  fontFamily: 'Roboto-Regular',
                }}>
                Please
              </Text>
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  fontFamily: 'Roboto-Regular',
                }}>
                tap the
              </Text>
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'purple',
                  fontFamily: 'Roboto-Regular',
                }}>
                mic
              </Text>
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  fontFamily: 'Roboto-Regular',
                }}>
                below, then say your
              </Text>
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'purple',
                  fontFamily: 'Roboto-Regular',
                }}>
                name
              </Text>
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  fontFamily: 'Roboto-Regular',
                }}>
                and
              </Text>
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'purple',
                  fontFamily: 'Roboto-Regular',
                }}>
                date of birth
              </Text>
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  fontFamily: 'Roboto-Regular',
                }}>
                before joining your appointment."
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'gray',
                marginTop: 40,
                fontFamily: 'Roboto-Medium',
              }}>
              Tap Here
            </Text>
            <TouchableOpacity
              onPress={() => {
                setRecordState(true);
                startRecordingFunc();
              }}
              style={{
                padding: 15,
                borderRadius: 40,
                marginTop: 15,
                backgroundColor: '#0f75bc',
              }}>
              <Image
                source={recordState ? images.ear : images.microphone}
                resizeMode="contain"
                style={{width: 25, height: 25, tintColor: '#fff'}}
              />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <Button
                title="Join Appointment"
                loading={showLoading}
                onClick={() => {
                  uploadAudioVoice();
                }}
                disabled={audioFile ? false : true}
                style={{
                  marginTop: 55,
                  height: 45,
                  width: 160,
                  borderRadius: 10,
                  backgroundColor: !audioFile ? 'gray' : '#0f75bc',
                }}
              />
            </View>
            <View
              style={{position: 'absolute', bottom: 10, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Roboto-Bold',
                  color: '#000',
                  marginBottom: -25,
                }}>
                Powered by
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Image
                  source={images.ringcentral}
                  resizeMode="contain"
                  style={{width: 100, height: 100}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Bold',
                    color: '#000',
                    marginHorizontal: 6,
                  }}>
                  &
                </Text> */}
                <Image
                  source={images.patientVerifi}
                  resizeMode="contain"
                  style={{width: 100, height: 100}}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default AudioVerification;
