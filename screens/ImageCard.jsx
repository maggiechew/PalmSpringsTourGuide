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
  const test =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum, elit quis mattis commodo, mauris augue tincidunt libero, id porta est lorem nec nunc. Praesent varius vel massa eu consectetur. Etiam dignissim sit amet libero quis posuere. Donec et semper lacus. Suspendisse sodales facilisis odio, eget finibus quam mollis sed. Vivamus vestibulum convallis sapien, nec dictum nisl tempus dictum. Pellentesque bibendum a lacus in fringilla. Donec vitae diam et metus accumsan vehicula. In a enim urna. Nulla volutpat nisl at urna fringilla, id consectetur odio ullamcorper. Aliquam tincidunt tempus dignissim. Vivamus massa nisl, pharetra sit amet consequat at, maximus vitae felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat, sem quis placerat efficitur, turpis ligula congue neque, eget faucibus nulla purus at orci. Ut vulputate, neque quis laoreet cursus, dui massa pulvinar velit, non dapibus arcu purus vitae quam. Ut pulvinar hendrerit risus, sit amet vestibulum nulla laoreet eu. Sed egestas imperdiet leo, et porttitor nisl rutrum in. Fusce condimentum eros in ex viverra, quis ullamcorper ante condimentum. Sed efficitur metus neque, quis ullamcorper diam tempor eu. Etiam ut ipsum a erat dictum volutpat. Ut lobortis quis erat vel viverra. Mauris ornare bibendum risus, eget vehicula mauris vestibulum non. Integer luctus dapibus metus et pellentesque. Aenean et ante risus. Integer ac dolor nunc. Mauris mollis turpis sed consequat tincidunt. Cras purus nisi, efficitur eget ante varius, commodo molestie risus. Phasellus scelerisque at ex id fringilla.';
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
    const suggestedInt = Math.ceil(charLen / 100) * 5 + 15;

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
