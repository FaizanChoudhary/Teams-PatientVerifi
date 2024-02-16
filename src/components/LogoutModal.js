import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  StatusBar,
  Modal,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
// import {useDispatch} from 'react-redux';

import {logoutApi} from '../redux/auth/apis';

const LogoutModal = forwardRef((props, ref) => {
  // const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    getAlert() {
      setModalShow(true);
    },
  }));

  const logoutFunc = async () => {
    setShowLoading(true);
    await logoutApi();
    setShowLoading(false);
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalShow(false)}
        visible={modalShow}>
        <StatusBar
          backgroundColor="rgba(0, 0, 0, 0.38)"
          barStyle="dark-content"
        />
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.38)',
          }}
          onPress={() => setModalShow(false)}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}>
          <View
            style={{
              marginHorizontal: 42,
              zIndex: 3,
              marginTop: 100,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
              }}>
              <View
                style={{
                  marginVertical: 23,
                  marginHorizontal: 25,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Bold',
                    color: '#000',
                  }}>
                  Logout
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#000',
                    marginTop: 5,
                  }}>
                  Are you sure!
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'flex-end',
                  marginBottom: 24,
                  marginHorizontal: 25,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity onPress={() => setModalShow(false)}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Roboto-Bold',
                        color: '#000',
                        marginRight: 40,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  {!showLoading ? (
                    <TouchableOpacity
                      style={{padding: 5}}
                      onPress={() => logoutFunc()}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Roboto-Bold',
                          color: '#000',
                        }}>
                        Ok
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{alignItems: 'center'}}>
                      <ActivityIndicator size="small" color="#000" />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
});

export default LogoutModal;
