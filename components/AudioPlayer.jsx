import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { StyleSheetContext } from '../providers/StyleSheetProvider';
import { SiteUserContext } from '../providers/SiteSoundProvider';
import { convertTime } from '../utils/audioHelpers';

const AudioPlayer = ({ contentButton, contentScreen, fromMySites }) => {
  const {
    isPlayerReady,
    setIsPlayerReady,
    isPlaying,
    setIsPlaying,
    sound,
    setSound,
    currentSite,
    duration,
    setDuration,
    position,
    setPosition,
    sheetOpen
  } = useContext(SiteUserContext);

  const styles = useContext(StyleSheetContext);

  const navigation = useNavigation();

  // ANIMATION TEST
  const testAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        // prettier-ignore
        scale: withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.8, { duration: 400 })
          ),
          -1,
          true
        )
      }
    ]
  }));

  useEffect(() => {
    // console.log('AUDIOEFFECT: ', currentSite);
    if (
      (currentSite && !contentScreen) ||
      (currentSite && contentScreen && fromMySites)
    ) {
      loadAudio(currentSite);
    }
    if (currentSite === null) {
      // console.log('AUDIO: i am a null site');
      setIsPlayerReady(false);
      unloadAudio();
      // setSound(undefined);
    }
    // console.log('audio player', currentSite);
  }, [currentSite]);

  useEffect(() => {
    async function justFinished() {
      await sound.pauseAsync();
      setPosition(1);
      await sound.setPositionAsync(1);
      setIsPlaying(false);
    }
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded && currentSite) {
          loadAudio(currentSite);
        }
        if (!status.isLoaded && !currentSite) {
          setIsPlayerReady(false);
        }
        if (status.isLoaded && !isPlayerReady) {
          setIsPlayerReady(true);
        }
        if (isPlayerReady) {
          setPosition(status.positionMillis);
        }
        if (status.isLoaded && !status.isPlaying) {
          setDuration(status.durationMillis);
        }
        if (status.didJustFinish) {
          justFinished();
        }
      });
    }
  }, [sound, isPlayerReady]);

  async function loadAudio(passedSite) {
    // console.log('LOAD: ', sound);
    if (sound && isPlaying) {
      // console.log('LOADAUDIO: sound and isplaying'); // UNHANDLED HERE!!
      await sound.pauseAsync();
      // await sound.unloadAsync();
      await setSound(undefined);
      setIsPlaying(false);
      setIsPlayerReady(false);
    }
    if (passedSite !== null) {
      // console.log('LOAD AUDIO: i am loading');
      const { sound: soundData } = await Audio.Sound.createAsync(
        { uri: passedSite.siteURIs.audioURI },
        { shouldPlay: false }
      );
      setSound(soundData);
      setIsPlayerReady(true);
      setIsPlaying(false);
    }
  }

  async function unloadAudio() {
    if (sound) {
      await sound.pauseAsync();
      await sound.unloadAsync();
    }
    setSound(undefined);
    setIsPlayerReady(false);
    setIsPlaying(false);
  }

  async function pausePlayAudio() {
    if (!sound) {
      return;
    }
    if (!isPlaying && isPlayerReady) {
      await sound.playAsync();
      setIsPlaying(true);
      // console.log('PLAYING: ', currentSite);
    }
    if (isPlaying && isPlayerReady) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  function calculateSeekBar() {
    if (currentSite === null) {
      return 0;
    }
    if (isPlayerReady && position) {
      return position / duration;
    }
  }

  const renderCurrentTime = () => {
    return convertTime((duration - position) / 1000);
  };

  return (
    // <View style={contentButton ? styles.modal : styles.modalSmall}>
    <View style={styles.modal}>
    <Text style={styles.siteName}>{currentSite.siteName}</Text>
      {/* {!currentSite ? (
        <Text style={styles.siteName}>'No site loaded'</Text>
      ) : contentButton ? (
        <Text style={styles.siteName}>{currentSite.siteName}</Text>
      ) : (
        <></>
      )} */}
      <View style={styles.audioPlayer}>
        {contentButton ? (
          <Animated.View style={testAnimation}>
            <IconButton
              icon='sunglasses'
              iconColor='gold'
              containerColor={`#111111`}
              style={{'marginTop':-10, 'marginBottom':0, 'paddingLeft':6}}
              onPress={() => {
                navigation.navigate('Content');
              }}
              size={40}
            />
            <Text style={styles.learnMore}>Learn more</Text>
          </Animated.View>
        ) : (
          <></>
        )}

        {isPlaying ? (
          <IconButton
            icon='pause-circle'
            iconColor='#f57c00'
            containerColor={`#111111`}
            onPress={() => pausePlayAudio()}
            size={35}
          />
        ) : (
          <IconButton
            icon='play-circle'
            iconColor='#f57c00'
            containerColor={`#111111`}
            onPress={() => pausePlayAudio()}
            size={35}
          />
        )}

        <Slider
          style={{ width: 170, height: 30 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeekBar()}
          minimumTrackTintColor={'orange'}
          maximumTrackTintColor={'dimgrey'}
          thumbTintColor={'#f57c00'}
          onValueChange={async (value) => {
            // await sound.setPositionAsync(value * duration);
            // console.log('2');
            // await setPosition(value * duration);
          }}
          // onSlidingStart={async () => {
          //   if (!isPlaying) return;

          //   try {
          //     await pausePlayAudio();
          //   } catch (error) {
          //     console.log('error inside onSlidingStart callback', error);
          //   }
          // }}
          onSlidingComplete={async (value) => {
            try {
              const status = await sound.setPositionAsync(
                Math.floor(duration * value)
              );
              setPosition(Math.floor(duration * value));
            } catch (error) {
              console.log('error inside onSlidingComplete callback', error);
            }
          }}
          step={0.01}
        />
        <Text style={{ color: '#f57c00', marginLeft: 8 }}>
          -{renderCurrentTime()}
        </Text>
      </View>
    </View>
  );
};

export default AudioPlayer;