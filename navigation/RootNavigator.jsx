import { NavigationContainer } from '@react-navigation/native';
import React, { useContext } from 'react';
import { LoadingIndicator } from '../components';
import { AuthenticatedUserContext } from '../providers';
import SiteSoundProvider from '../providers/SiteSoundProvider';
import StyleSheetProvider from '../providers/StyleSheetProvider';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export const RootNavigator = () => {
  const { user, isLoading } = useContext(AuthenticatedUserContext);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SiteSoundProvider>
      <StyleSheetProvider>
        <NavigationContainer>
          {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </StyleSheetProvider>
    </SiteSoundProvider>
  );
};
