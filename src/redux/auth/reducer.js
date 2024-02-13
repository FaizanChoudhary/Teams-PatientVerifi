import {REHYDRATE} from 'redux-persist';
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

const INITIAL_STATE = {
  loader: false,
  imageUrls: null,
  loading: false,
  customerInfo: null,
  backIDInfo: null,
  selfieInfo: null,
  userExist: false,
  frontIDInfo: null,
  customerUUID: null,
  customerToken: null,
  faceMatchInfo: null,
  audio_onboarding: null,
  incode_onboarding: null,
  customerInterviewId: null,
  verificationHistory: [],
  meetingData: null,
};

export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action;
  switch (type) {
    case REHYDRATE:
      return {
        ...state,
        customerInfo: payload?.auth?.customerInfo,
        incode_onboarding: payload?.auth?.incode_onboarding,
        audio_onboarding: payload?.auth?.audio_onboarding,
        meetingData: payload?.auth?.meetingData,
      };
    case LOGIN:
      return {...state, loading: true};
    case LOGIN_SUCCESS:
      return {...state, customerInfo: payload, loading: false};
    case LOGIN_FAILED:
      return {...state, loading: false};

    case AUDIO_ON_BOARDING:
      return {...state, audio_onboarding: payload};

    case INCODE_ON_BOARDING:
      return {...state, incode_onboarding: payload};

    case CUSTOMER_TOKEN:
      return {...state, customerToken: payload};

    case CUSTOMER_INTERVIEW_ID:
      return {...state, customerInterviewId: payload};

    case CUSTOMER_UUID:
      return {...state, customerUUID: payload};

    case SELFIE_INFO:
      return {...state, selfieInfo: payload};

    case FRONT_ID_INFO:
      return {...state, frontIDInfo: payload};

    case BACK_ID_INFO:
      return {...state, backIDInfo: payload};

    case FACE_MATCH:
      return {...state, faceMatchInfo: payload};

    case GET_CUSTOMER_HISTORY:
      return {...state, verificationHistory: payload};

    case USER_EXIST:
      return {...state, userExist: payload};

    case LOADER:
      return {...state, loader: payload};

    case IMAGE_URLS:
      return {...state, imageUrls: payload};

    case LOG_OUT:
      return {...INITIAL_STATE};

    case MEETING_DATA:
      return {...state, meetingData: payload};

    default:
      return state;
  }
};
