import {
  LOGIN,
  LOADER,
  IMAGE_URLS,
  LOG_OUT,
  USER_EXIST,
  FACE_MATCH,
  SELFIE_INFO,
  BACK_ID_INFO,
  LOGIN_FAILED,
  FRONT_ID_INFO,
  CUSTOMER_UUID,
  LOGIN_SUCCESS,
  CUSTOMER_TOKEN,
  AUDIO_ON_BOARDING,
  INCODE_ON_BOARDING,
  CUSTOMER_INTERVIEW_ID,
  GET_CUSTOMER_HISTORY,
  MEETING_DATA,
} from './types';

export const login = (email, password) => {
  return {
    type: LOGIN,
    payload: {email: email, pass: password},
  };
};
export const loginSuccess = customerInfo => {
  return {
    type: LOGIN_SUCCESS,
    payload: customerInfo,
  };
};
export const loginfailed = () => {
  return {
    type: LOGIN_FAILED,
  };
};

export const logout = () => {
  return {
    type: LOG_OUT,
  };
};

export const audioOnBoard = info => {
  return {
    type: AUDIO_ON_BOARDING,
    payload: info,
  };
};

export const inCodeOnBoard = info => {
  return {
    type: INCODE_ON_BOARDING,
    payload: info,
  };
};

export const setCustomerUUID = id => {
  return {
    type: CUSTOMER_UUID,
    payload: id,
  };
};

export const setCustomerToken = token => {
  return {
    type: CUSTOMER_TOKEN,
    payload: token,
  };
};

export const setCustomerInterviewId = id => {
  return {
    type: CUSTOMER_INTERVIEW_ID,
    payload: id,
  };
};

export const setSelfieInfo = data => {
  return {
    type: SELFIE_INFO,
    payload: data,
  };
};

export const setFrontIDInfo = data => {
  return {
    type: FRONT_ID_INFO,
    payload: data,
  };
};

export const setBackIDInfo = data => {
  return {
    type: BACK_ID_INFO,
    payload: data,
  };
};

export const faceMatchInfo = data => {
  return {
    type: FACE_MATCH,
    payload: data,
  };
};

export const getVerificationHistory = data => {
  return {
    type: GET_CUSTOMER_HISTORY,
    payload: data,
  };
};

export const userExist = bool => {
  return {
    type: USER_EXIST,
    payload: bool,
  };
};

export const showLoader = bool => {
  return {
    type: LOADER,
    payload: bool,
  };
};

export const setImageUrls = (logo, waterMark) => {
  return {
    type: IMAGE_URLS,
    payload: {logo, waterMark},
  };
};

export const setMeetingData = data => {
  return {
    type: MEETING_DATA,
    payload: data,
  };
};
