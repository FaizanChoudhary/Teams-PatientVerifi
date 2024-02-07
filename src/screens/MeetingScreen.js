// import {useNavigation} from '@react-navigation/native';
// import React, {useEffect, useState} from 'react';
// import {NativeEventEmitter, StatusBar, View} from 'react-native';
// import ZoomUs, {ZoomEmitter} from 'react-native-zoom-us';
// import {useSelector} from 'react-redux';
// import {getZoomClientData, updateMeetingStatus} from '../redux/auth/apis';

// const MeetingScreen = () => {
//   const [isInitialized, setIsInitialized] = useState(false);
//   // const [joinMeetingStatus, setJoinMeetingStatus] = useState(false);
//   const navigation = useNavigation();
//   const meetingInfo = useSelector(state => state.auth?.meetingData);

//   const joinMeeting = async meetingDetails => {
//     try {
//       const joinMeetingResult = await ZoomUs.joinMeeting({
//         autoConnectAudio: true,
//         userName: meetingDetails?.userName,
//         meetingNumber: meetingDetails?.meetingId,
//         password: meetingDetails?.password,
//         noMeetingErrorMessage: true, // Set this to be able to show Alert.alert
//       })
//         .then(() =>
//           updateMeetingStatus(
//             meetingDetails?.meetingId,
//             meetingDetails?.userId,
//             'join',
//           ),
//         )
//         .catch(() =>
//           updateMeetingStatus(
//             meetingDetails?.meetingId,
//             meetingDetails?.userId,
//             'failed',
//           ),
//         );

//       console.log({joinMeetingResult});
//     } catch (e) {
//       // Alert.alert('Error', 'Could not execute joinMeeting');
//       console.error('ERR', e);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const clientData = await getZoomClientData(meetingInfo);
//         if (!clientData) {
//           return;
//         }
//         console.log('=============clientData===================');
//         console.log(clientData);
//         console.log('====================================');
//         const message = await ZoomUs.initialize(
//           {
//             jwtToken: clientData.token,
//             domain: 'zoom.us',
//           },
//           {
//             disableShowVideoPreviewWhenJoinMeeting: true,
//             disableMinimizeMeeting: true,
//           },
//         );
//         console.log('message is ', message);
//         setIsInitialized(true);
//         joinMeeting(meetingInfo);
//       } catch (error) {
//         console.log('error =>', error);
//         // Alert.alert('error is ', error.toString());
//       }
//     })();
//   }, [meetingInfo]);

//   // useEffect(() => {
//   //   const listener = ZoomUs.onMeetingStatusChange(({event}) => {
//   //     // console.log('onMeetingStatusChange', event);
//   //     if (event === 'MEETING_STATUS_DISCONNECTING') {
//   //       setJoinMeetingStatus(false);
//   //     }
//   //   });
//   //   const joinListener = ZoomUs.onMeetingJoined(() => {
//   //     // console.log('onMeetingJoined');
//   //     setJoinMeetingStatus(true);
//   //   });
//   //   return () => {
//   //     listener.remove();
//   //     joinListener.remove();
//   //   };
//   // }, []);

//   useEffect(() => {
//     if (!isInitialized) {
//       return;
//     }

//     // For more see https://github.com/mieszko4/react-native-zoom-us/blob/master/docs/EVENTS.md
//     const zoomEmitter = new NativeEventEmitter(ZoomEmitter);
//     const eventListener = zoomEmitter.addListener(
//       'MeetingEvent',
//       ({event, status, ...params}) => {
//         console.log({event, status, params}); //e.g.  "endedByHost" (see more: https://github.com/mieszko4/react-native-zoom-us/blob/master/docs/EVENTS.md)

//         // if (status === 'MEETING_STATUS_CONNECTING') {
//         //   setIsMeetingOngoing(true);
//         // }

//         if (status === 'MEETING_STATUS_DISCONNECTING') {
//           // Once it is set it is good to render
//           navigation.navigate('TopTabView');
//         }
//       },
//     );

//     return () => eventListener.remove();
//   }, [isInitialized, navigation]);

//   return (
//     <View
//       style={{
//         height: '100%',
//         width: '100%',
//         backgroundColor: 'black',
//       }}>
//       <StatusBar barStyle={'light-content'} backgroundColor={'#1D1F24'} />
//       {/* {joinMeetingStatus === true ? (
//         <ZoomUsVideoView
//           style={StyleSheet.absoluteFillObject}
//           layout={[
//             // The active speaker
//             {kind: 'active', x: 0, y: 0, width: 1, height: 1},
//             // Selfcamera preview
//             {
//               kind: 'preview',
//               // The percent of video view (required)
//               x: 0.73,
//               y: 0.73,
//               width: 0.25,
//               height: 0.2,
//               // Enable border (optional)
//               border: true,
//               // Disable show user name (optional)
//               // showUsername: false,
//               // Show audio off (optional)
//               showAudioOff: true,
//               // Background color (optional)
//               background: '#ccc',
//             },
//           ]}
//         />
//       ) : null} */}
//     </View>
//   );
// };
// export default MeetingScreen;
