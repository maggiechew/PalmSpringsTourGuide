import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSiteUserContext } from '../providers/SiteSoundProvider';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  BounceIn,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { StyleSheetContext } from '../providers/StyleSheetProvider';

const NewSiteDiscovery = () => {
  const { showModal, setShowModal } = useSiteUserContext();
  const navigation = useNavigation();
  const styles = useContext(StyleSheetContext);

  // ANIMATION TEST
  const testAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        // prettier-ignore
        scale: withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.9, { duration: 600 }),
            withSpring(1.1)
          ),
          -1,
          true
        ),
      },
    ],
  }));

  return (
    <View style={styles.newSiteContainer}>
      <Image
        style={{ width: 200, height: 200 }}
        source={require('../assets/egg_crack_gold.gif')}
      />
      <Text style={styles.newSiteBodyText}>You've discovered a new site!</Text>
      <Pressable
        onPress={() => {
          setShowModal(false);
          navigation.navigate('Content');
        }}
      >
        <Animated.View style={testAnimation}>
          <Text style={styles.clickMeText}>
            Tap to learn more about this site!
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default NewSiteDiscovery;
