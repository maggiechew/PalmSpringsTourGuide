import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider } from './providers';
import { AvatarPickProvider } from './providers/AvatarPickProvider';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';


export default function App() {

  const [fontsLoaded] = useFonts({
    RWLight: require('./assets/fonts/Raleway-Light.ttf'),
    RWRegular: require('./assets/fonts/Raleway-Regular.ttf'),
    RWBold: require('./assets/fonts/Raleway-Bold.ttf'),
    'Limelight-Regular': require('./assets/fonts/Limelight-Regular.ttf')
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <AvatarPickProvider>
      <AuthenticatedUserProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </AvatarPickProvider>
  );
};