import {useSelector} from 'react-redux';

export const isUserLoggedIn = () =>
  useSelector(state => state.auth?.customerInfo?.access_token);

export const userDetail = () =>
  useSelector(state => state.auth?.customerInfo);

export const isAudioAuthenticate = () =>
  useSelector(state => state.auth?.audio_onboarding);

export const isIncodeAuthenticate = () =>
  useSelector(state => state.auth?.incode_onboarding);

export const isIncodeManual = () =>
  useSelector(state => state.auth?.incode_onboarding?.is_review_required);

export const isLoaderEnable = () =>
  useSelector(state => state.auth?.loader);

export const isPhoneVerified = () =>
  useSelector(state => state.auth?.customerInfo?.phone_verified);
