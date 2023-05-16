import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, View, Image, Platform } from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import { TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Images, Colors } from '../config';
// import { useTogglePasswordVisibility } from '../hooks';
// import { loginValidationSchema } from '../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { AuthenticatedUserContext } from '../providers';

const LoginScreen = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.logoContainer}>
            <Text style={styles.screenTitle}>Palm Springs</Text>
            <Text style={styles.screenTitle2}>Tour Guide</Text>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
    // <View>
    //   <Text>LoginScreen</Text>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `#ffffff`,
    paddingHorizontal: 12,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  screenTitle: {
    //   paddingBottom: 50,
    fontFamily: 'Limelight-Regular',
    fontSize: 80,
    color: 'orange',
    ...Platform.select({
      ios: {
        marginTop: 20,
        marginBottom: -10,
      },
      android: {
        marginTop: 50,
        //   marginBottom: 0
      },
    }),
  },
  screenTitle2: {
    //   paddingVertical: 0,
    fontFamily: 'Limelight-Regular',
    fontSize: 35,
    color: 'orange',
  },
  footer: {
    backgroundColor: `#111111`,
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'orange',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'gold',
  },
});

export default LoginScreen;
