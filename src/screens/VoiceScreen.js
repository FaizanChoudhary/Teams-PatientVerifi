import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Sound from 'react-native-sound';
import {useDispatch} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import RNExitApp from 'react-native-exit-app';
import AudioRecord from 'react-native-audio-record';
import {useNavigation} from '@react-navigation/native';
import {check, request, PERMISSIONS} from 'react-native-permissions';

import images from '../constants/images';
import Header from '../components/Header';
import Button from '../components/Button';
import {SERVER_URL} from '../utils/baseUrl';
import { logout } from '../redux/auth/actions';
import {isUserLoggedIn} from '../redux/auth/selectors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VoiceScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const token = isUserLoggedIn();

  const [showLoading, setShowLoading] = useState(false);
  const [stopRecording, setStopRecording] = useState(false);
  const [startRecording, setStartRecording] = useState(true);
  const [listenRecording, setListenRecording] = useState(false);
  const [playSuccessfully, setPlaySuccessfully] = useState(false);

  const [audioFile, setAudioFile] = useState('');
  var audioSound;

  const AUDIO_OPTIONS = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    wavFile: 'test.wav',
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

  const playAudio = () => {
    setPlaySuccessfully(true);
    audioSound = new Sound(audioFile, '', error => {
      if (error) {
        setPlaySuccessfully(false);
        console.log('failed to load the sound', error);
        return;
      }

      Sound.setCategory('Playback');
      // Play the sound with an onEnd callback
      audioSound.play(success => {
        console.log('success =>', success);
        if (success) {
          setPlaySuccessfully(false);
          console.log('successfully finished playing');
        } else {
          setPlaySuccessfully(false);
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
    audioSound.setVolume(1);
  };

  const uploadAudioVoice = async () => {
    try {
      setShowLoading(true);
      var formData = new FormData();
      formData.append('media_type', 'AUDIO_ONBOARDING');
      formData.append('file', {
        uri: `file:///${audioFile}`,
        type: 'audio/wav',
        name: 'sound.wav',
      });

      const response = await fetch(`${SERVER_URL}/user/audio/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      });
      const resp = await response.json();
      if (resp?.data) {
        navigation.reset({
          index: 0,
          routes: [{name: 'ThankYou', params: {response: resp?.data}}],
        });
      } else if (resp?.errors[0]?.message === 'E_UNAUTHORIZED_ACCESS: Unauthorized access') {
        await AsyncStorage.removeItem('userToken');
        dispatch(logout());
        Snackbar.show({
          text: 'You are unauthorized user. Please contact administrator.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#575DFB',
        });
      } 
      else {
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

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Header />
      <View
        style={{
          flex: 1,
          marginTop: StatusBar?.currentHeight + 30,
          marginHorizontal: 20,
        }}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'ios') {
                RNExitApp.exitApp();
              } else {
                BackHandler.exitApp();
              }
            }}
            style={{marginTop: Platform.OS === 'ios' ? 30 : 0}}>
            <Image
              resizeMode="contain"
              source={images.cross}
              style={{width: 16, height: 16}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Medium',
              color: '#000',
              marginLeft: 10,
              marginTop: 35,
              textAlign: 'center'
            }}>
            Please tap on the record button to record your voice
          </Text>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto-Regular',
                color: '#000',
                textAlign: 'center',
                marginHorizontal: 40,
              }}>
              My account is secure because my voice is my password
            </Text>
            {startRecording ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setStopRecording(true);
                  setStartRecording(false);
                  startRecordingFunc();
                }}
                style={{
                  width: 160,
                  height: 160,
                  backgroundColor: '#575DFB',
                  borderRadius: 160,
                  borderWidth: 5,
                  borderColor: '#000',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 60,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Roboto-Medium',
                    color: '#fff',
                  }}>
                  Record
                </Text>
              </TouchableOpacity>
            ) : stopRecording ? (
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 160,
                    borderWidth: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 60,
                  }}>
                  <Image
                    resizeMode="contain"
                    source={images.wave}
                    style={{width: 120, height: 130}}
                  />
                </View>
                <Button
                  title="Stop"
                  onClick={() => {
                    setStopRecording(false);
                    setListenRecording(true);
                    stopRecordingFunc();
                  }}
                  style={{
                    width: 120,
                    backgroundColor: '#575DFB',
                    marginVertical: 40,
                  }}
                />
              </View>
            ) : listenRecording ? (
              <>
                {playSuccessfully ? (
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: 160,
                      borderWidth: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 60,
                    }}>
                    <Image
                      resizeMode="contain"
                      source={images.wave}
                      style={{width: 120, height: 130}}
                    />
                  </View>
                ) : (
                  <Image
                    resizeMode="contain"
                    source={images.recording}
                    style={{width: 160, height: 160, marginTop: 60}}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                  }}>
                  <TouchableOpacity onPress={() => playAudio()}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Medium',
                        color: '#575DFB',
                      }}>
                      Listen
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 40,
                      width: 1,
                      backgroundColor: '#C8C8C8',
                      marginHorizontal: 35,
                    }}
                  />
                  <TouchableOpacity
                    disabled={playSuccessfully}
                    onPress={() => {
                      setStartRecording(true);
                      setListenRecording(false);
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Medium',
                        color: '#000',
                      }}>
                      Re-record
                    </Text>
                  </TouchableOpacity>
                </View>
                <Button
                  title="Submit"
                  disable={playSuccessfully}
                  loading={showLoading}
                  onClick={() => {
                    if (audioFile) {
                      uploadAudioVoice();
                    } else {
                      Snackbar.show({
                        text: 'Please Re-record your voice',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: '#575DFB',
                      });
                    }
                  }}
                  style={{
                    width: 255,
                    backgroundColor: '#575DFB',
                    marginTop: 70,
                    marginBottom: 30,
                  }}
                />
              </>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default VoiceScreen;
