import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MapPage from '../screens/MapPage';
import { AccountScreen } from '../screens/AccountScreen';
import { FriendsScreen } from '../screens/FriendsScreen.jsx';
import { MySitesScreen } from '../screens/MySitesScreen';
import { useNavigation } from '@react-navigation/native';
import { ContentScreen } from '../screens/ContentScreen';
import * as ScreenOrientation from 'expo-screen-orientation';

import { Entypo } from '@expo/vector-icons';
import ImageCard from '../screens/ImageCard';

const Stack = createStackNavigator();

export const AppStack = () => {
  const navigation = useNavigation();

  async function changeScreenOrientation() {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  }


  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Map"
        component={MapPage}
        options={{
          title: 'Palm Springs Tour Guide',
          headerTitleStyle: { color: 'gold', fontFamily: 'Limelight-Regular' },
          headerStyle: { backgroundColor: `#111111` },
        }}
      />

      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Entypo name="chevron-left" size={24} color={`#111111`} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="MySites"
        component={MySitesScreen}
        options={{
          headerTitleStyle: { color: 'gold', fontFamily: 'Limelight-Regular' },
          headerStyle: { backgroundColor: `#111111` },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Entypo name="chevron-left" size={24} color="gold" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Content"
        component={ContentScreen}
        options={{
          headerTitleStyle: { color: 'gold', fontFamily: 'Limelight-Regular' },
          headerStyle: { backgroundColor: `#111111` },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Entypo name="chevron-left" size={24} color="gold" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ImageCard"
        component={ImageCard}
        options={{
          headerTitleStyle: { color: 'gold', fontFamily: 'Limelight-Regular' },
          headerStyle: { backgroundColor: `#111111` },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                changeScreenOrientation();
                navigation.goBack()}}
            >
              <Entypo name="chevron-left" size={24} color="gold" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
});
