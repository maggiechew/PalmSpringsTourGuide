import { View, Text, Image, StyleSheet, Modal } from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import * as ScreenOrientation from 'expo-screen-orientation';

const ImageCard = ({ navigation, route }) => {
  const [upperSnap, setUpperSnap] = useState(50);
  const imgURI = route.params.imgInfo[0];
  const imgDesc = route.params.imgInfo[1];
  const imgTitle = route.params.imgInfo[2];
  const bottomSheetRef = useRef(null);
//   const handleSheetChanges = useCallback((index) => {
//     console.log('handleSheetChanges', index);
//     console.log('upper snap is', upperSnap);
//   }, []);

  useEffect(() => {
    changeScreenOrientation();
  }, []);

  useEffect(() => {
    const charLen = imgDesc.length;
    const suggestedInt = Math.ceil(charLen / 100) * 5 + 20;
    console.log(suggestedInt)

    suggestedInt > 100? setUpperSnap(100) : setUpperSnap(suggestedInt)
  }, []);


  async function changeScreenOrientation() {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  }

  return (
    <View>
      <Image style={styles.container} source={{ uri: imgURI }}></Image>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={['5%', `${upperSnap}%`]}
        backgroundStyle={{ backgroundColor: '#ffffff' }}
      >
        <View>
          <Text style={{ color: 'black', paddingLeft: 20, fontWeight: 'bold' }}>
            {imgTitle}
          </Text>
         
            <Text style={{ color: 'black', paddingLeft: 20 }}>
              {imgDesc}
              {'\n'}
            </Text>
          
          {/* <br /> */}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ImageCard;
