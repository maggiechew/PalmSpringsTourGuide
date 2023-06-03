import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SiteUserContext } from '../providers/SiteSoundProvider';
import AudioPlayer from './AudioPlayer';
import { SiteContent } from './SiteContent';

export default function AudioSheet() {
  const {
    currentSite,
    sheetOpen,
    setSheetOpen,
    sound,
    setSound,
    setIsPlayerReady,
    setIsPlaying
  } = useContext(SiteUserContext);
  const navigation = useNavigation();


  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['20%', '64%'], []);
  const handleSheetChanges = useCallback((index) => {}, []);
  const handleClosePress = () => bottomSheetRef.current.close();

  const audioURI = currentSite?.siteURIs.audioURI;
  useEffect(() => {
    if (currentSite) {
      setSheetOpen(0);
    }
    if (currentSite === null) {
      setSheetOpen(-1);
      handleClosePress();
      if (sound) {
        sound.pauseAsync();
        sound.unloadAsync();
      }
      setSound(undefined);
      setIsPlayerReady(false);
      setIsPlaying(false);
    }
  }, [currentSite]);

  useEffect(() => {}, [sheetOpen]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={sheetOpen}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: `#111111` }}
      handleIndicatorStyle={{ color: 'orange', backgroundColor: '#f57c00' }}
    >
      {audioURI && (
        <AudioPlayer contentButton contentPage={false} fromMySites={false} />
      )}
      <BottomSheetScrollView>
        {currentSite !== null ? <Pressable onPress={() => {
                navigation.navigate('Content');
              }}><SiteContent /></Pressable> : <Text>Loading...</Text>}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}