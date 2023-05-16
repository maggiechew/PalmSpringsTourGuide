import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, View, Image, Platform } from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Images, Colors } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthenticatedUserContext } from '../providers';

export const LoginScreen = ({ navigation }) => {
  const authContext = useContext(AuthenticatedUserContext);
  const { errorState, handleLogin } = authContext;

  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();
  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.logoContainer}>
            <Text style={styles.screenTitle}>Palm Springs</Text>
            <Text style={styles.screenTitle2}>Tour Guide</Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <>
                {/* Input fields */}
                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoFocus={true}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="password"
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {/* Display Screen Error Mesages */}
                {errorState !== '' ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                {/* Login button */}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </>
            )}
          </Formik>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Create a new account?'}
            onPress={() => navigation.navigate('Signup')}
          />
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Forgot Password'}
            onPress={() => navigation.navigate('ForgotPassword')}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <View style={styles.footer}>
        <Text
          style={styles.footerText}
          onPress={() => navigation.navigate('Home')}
        >
          Palm Springs Tour Guide © {new Date().getFullYear()}
        </Text>
      </View>
    </>
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
    marginBottom: 50,
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
    paddingVertical: 12,
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
    color: 'orange',
  },
});

// export default LoginScreen;
