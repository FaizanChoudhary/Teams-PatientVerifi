import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  audioOnBoard,
  getVerificationHistory,
  inCodeOnBoard,
  loginSuccess,
  logout,
  showLoader,
} from './actions';
import {store} from '../stores/configureStore';
import {SERVER_URL} from '../../utils/baseUrl';

export const fcmTokenApi = async fcmToken => {
  try {
    const token = store.getState().auth?.customerInfo?.access_token;
    const response = await fetch(SERVER_URL + '/user/savefcmtoken', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({fcm_token: fcmToken}),
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('fcmTokenError =>', error);
  }
};

export const userScoreStatus = async () => {
  try {
    const token = store.getState().auth?.customerInfo?.access_token;
    const interviewId = store.getState().auth?.customerInterviewId;
    store.dispatch(showLoader(true));

    const response = await fetch(
      SERVER_URL + `/user/sessionScore/${interviewId}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    );
    const resp = await response.json();
    return resp?.data;
  } catch (error) {
    console.log('userScoreStatusError =>', error);
  } finally {
    store.dispatch(showLoader(false));
  }
};

export const storeIncodeInfoApi = async (
  accessToken,
  status,
  reason,
  extraDetail,
) => {
  try {
    const customerInterviewId = store.getState().auth?.customerInterviewId;
    const customerToken = store.getState().auth?.customerToken;
    const faceMatchInfo = store.getState().auth?.faceMatchInfo;
    const customerUUID = store.getState().auth?.customerUUID;
    const frontIDInfo = store.getState().auth?.frontIDInfo;
    const backIDInfo = store.getState().auth?.backIDInfo;
    const selfieInfo = store.getState().auth?.selfieInfo;

    store.dispatch(showLoader(true));

    // if (!faceMatchInfo?.existingUser) {
    const response = await fetch(SERVER_URL + '/user/saveCustomerProfile', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        status: status,
        id_back: backIDInfo,
        selfie: selfieInfo,
        id_front: frontIDInfo,
        type: 'INCODE_ONBORDING',
        customer_uuid: customerUUID,
        customer_token: customerToken,
        customer_interViewId: customerInterviewId,
        reason: reason ? reason : null,
        extra_details: extraDetail ? extraDetail : null,
      }),
    });
    const resp = await response.json();
    console.log('storeIncodeInfoApi resp', resp);
    if (resp?.onboarding) {
      store.dispatch(inCodeOnBoard(resp?.onboarding));
      Snackbar.show({
        text: resp?.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#575DFB',
      });
    } else {
      Snackbar.show({
        text: 'ID card verification failed, kindly try again',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#575DFB',
      });
    }
    // }
  } catch (error) {
    console.log('incode onboarding =>', error);
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
  } finally {
    store.dispatch(showLoader(false));
  }
};

export const updateMeetingStatus = async (meetingId, userID, action) => {
  try {
    const token = store.getState().auth?.customerInfo?.access_token;
    await fetch(SERVER_URL + '/api/meetingStatus', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        meeting_id: meetingId,
        user_id: userID,
        status: action,
      }),
    });
  } catch (error) {
    console.log('updateMeetingStatus =>', error);
  }
};

export const selfieVerificationApi = async (data, meetingId) => {
  try {
    const userID = store.getState().auth?.customerInfo?.id;
    const token = store.getState().auth?.customerInfo?.access_token;

    const response = await fetch(SERVER_URL + '/user/selfieVerification', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        type: 'SELFIE_VERIFICATION',
        data: data,
        meeting_id: meetingId,
      }),
    });
    // const resp =
    await response.json();
    // Snackbar.show({
    //   text: resp?.message,
    //   duration: Snackbar.LENGTH_SHORT,
    //   backgroundColor: '#575DFB',
    // });
    getCustomerHistory(userID);
  } catch (error) {
    console.log('incode onboarding =>', error);
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
  }
};

export const getCustomerHistory = async id => {
  try {
    const token = store.getState().auth?.customerInfo?.access_token;

    const response = await fetch(
      SERVER_URL + `/user/customer_verification_logs/${id}?type=all`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    );
    const resp = await response.json();
    if (resp?.data) {
      store.dispatch(getVerificationHistory(resp?.data));
    } else if (
      resp?.errors[0]?.message === 'E_UNAUTHORIZED_ACCESS: Unauthorized access'
    ) {
      await AsyncStorage.removeItem('userToken');
      store.dispatch(logout());
      Snackbar.show({
        text: 'You are unauthorized user. Please contact administrator.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#575DFB',
      });
    }
  } catch (error) {
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
  }
};

export const logoutApi = async () => {
  try {
    const token = store.getState().auth?.customerInfo?.access_token;

    const response = await fetch(SERVER_URL + `/user/logout`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
    });
    const resp = await response.json();
    if (resp?.status) {
      store.dispatch(logout());
    }
  } catch (error) {
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
  } finally {
    await AsyncStorage.removeItem('userToken');
    store.dispatch(logout());
  }
};

export const getCustomerData = async token => {
  try {
    store.dispatch(showLoader(true));
    const response = await fetch(SERVER_URL + '/user/customerDetails', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    });
    const resp = await response.json();
    if (resp?.data) {
      resp.data.access_token = token;
      store.dispatch(loginSuccess(resp?.data));
      if (resp?.data?.audio_onboarding) {
        store.dispatch(audioOnBoard(resp?.data?.audio_onboarding));
      }
      if (resp?.data?.incode_onboarding?.status !== 0) {
        store.dispatch(inCodeOnBoard(resp?.data?.incode_onboarding));
      }
    }
  } catch (error) {
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
    console.log('Login Error =>', error);
  } finally {
    store.dispatch(showLoader(false));
  }
};

export const getMeetingList = async filter => {
  try {
    store.dispatch(showLoader(true));
    const token = store.getState().auth?.customerInfo?.access_token;
    const response = await fetch(SERVER_URL + '/zoom/list', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        filter: filter,
        meetingType: 'TEAMS',
      }),
    });
    const resp = await response.json();
    if (resp.data) {
      return resp.data;
    } else {
      Snackbar.show({
        text: resp?.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#575DFB',
      });
      return [];
    }
  } catch (error) {
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
    console.log('Login Error =>', error);
  } finally {
    store.dispatch(showLoader(false));
  }
};

export const getZoomClientData = async meetingInfo => {
  try {
    const response = await fetch(SERVER_URL + '/api/zoom/meetings/jwt', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        meetingNumber: meetingInfo?.meetingId,
        role: 0,
        companyId: meetingInfo?.companyId,
      }),
    });
    const resp = await response.json();
    if (resp?.token) {
      return {
        token: resp.token,
      };
    } else {
      Snackbar.show({
        text: resp?.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#575DFB',
      });
      return null;
    }
  } catch (error) {
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
    console.log('getZoomClientData Error =>', error);
  }
};

export const getTeamsData = async () => {
  try {
    const token = store.getState().auth?.customerInfo?.access_token;
    const response = await fetch(SERVER_URL + '/teams/getToken', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });
    const resp = await response.json();
    if (resp.data?.token) {
      return {
        token: resp.data?.token,
      };
    } else {
      Snackbar.show({
        text: resp?.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#575DFB',
      });
      return null;
    }
  } catch (error) {
    Snackbar.show({
      text: 'Something went wrong',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#575DFB',
    });
    console.log('getZoomClientData Error =>', error);
  }
};
