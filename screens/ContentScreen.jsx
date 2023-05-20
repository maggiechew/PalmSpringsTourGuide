import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Text,
} from 'react-native-paper';
import AudioPlayer from '../components/AudioPlayer';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { SiteUserContext } from '../providers/SiteSoundProvider';
import Carousel from 'react-native-reanimated-carousel';
import * as ScreenOrientation from 'expo-screen-orientation';

export const ContentScreen = ({ fromMySites }) => {
  const { userInfo, user } = useContext(AuthenticatedUserContext);
  const { currentSite } = useContext(SiteUserContext);
  const images = currentSite.siteURIs.imageURIs;
  const arLink = currentSite.siteURIs.arURI;
  const userID = user.uid;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      changeScreenOrientation();
    }
  }, [isFocused]);

  async function changeScreenOrientation() {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }

  const newFavoriteSite = async () => {
    await updateDoc(doc(db, 'users', userID), {
      favoriteSites: arrayUnion(currentSite.id),
    });
  };

  const removeFavoriteSite = async () => {
    await updateDoc(doc(db, 'users', userID), {
      favoriteSites: arrayRemove(currentSite.id),
    });
  };

  const [theResult, setResult] = useState(null);

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(arLink);
    result ? setResult(result) : null;
  };
  const width = Dimensions.get('window').width;

  return (
    <View style={styles.background}>
      <ScrollView style={styles.container}>
        <Card mode="elevated" style={{ backgroundColor: `#111111` }}>
          {/* <Card mode='elevated' style={{ backgroundColor: `#111111`, flex:1, flexShrink:1 }}> */}
          <Card.Title
            title={currentSite.siteName}
            titleStyle={styles.title}
            titleNumberOfLines={2}
          />
          <View style={styles.audioContainer}>
            {currentSite.siteURIs.audioURI ? (
              <AudioPlayer
                contentButton={false}
                contentScreen={true}
                fromMySites={fromMySites}
              />
            ) : null}

            {!userInfo.favoriteSites.includes(currentSite.id) ? (
              <View>
                <IconButton
                  icon="heart-outline"
                  iconColor="gold"
                  containerColor={`#111111`}
                  onPress={() => {
                    newFavoriteSite(currentSite);
                  }}
                  size={35}
                />
              </View>
            ) : (
              <View>
                <IconButton
                  icon="heart"
                  iconColor="gold"
                  containerColor={`#111111`}
                  onPress={() => {
                    removeFavoriteSite(currentSite);
                  }}
                  size={35}
                />
              </View>
            )}
          </View>
          <Card.Content>
            {arLink && (
              <Button
                style={styles.arButton}
                onPress={() => {
                  _handlePressButtonAsync();
                }}
              >
                <Text>Try an Augmented Reality (AR) experience</Text>
              </Button>
            )}

            {/* <Divider />
            <Card.Cover source={{ uri: currentSite.siteURIs.imageURI }} /> */}
          </Card.Content>
        </Card>

        <View style={{ flex: 1 }}>
          <Carousel
            loop
            width={width}
            height={width * 2}
            // autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            renderItem={({ index }) => (
              <View style={{ backgroundColor: '#222222' }}>
                <Card>
                  <Card.Cover source={{ uri: images[index].URI }} />

                  <Card.Actions>
                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{paddingTop:10, fontWeight:'bold'}}>{images[index].imageTitle}</Text>
                      <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => {
                          const imgInfo = [
                            images[index].URI,
                            images[index].imageDescription,
                            images[index].imageTitle,
                          ];
                          navigation.navigate('ImageCard', { imgInfo });
                        }}
                      >
                        Press to learn more
                      </Button>
                    </View>
                  </Card.Actions>
                </Card>
              </View>
            
            )}
          />
        </View>
        <View>
          <Text style={styles.bodyText}>{currentSite.siteDescription}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: '80%',
  },
  card: {
    // height: '100%',
  },
  subcontent: {
    // height: '20%',
  },
  sampleAudio: {
    // height: '75%',
  },
  title: {
    fontFamily: 'Limelight-Regular',
    fontSize: 32,
    color: 'gold',
    paddingTop: 30,
    textAlign: 'center',
  },
  background: {
    height: '100%',
    alignContent: 'space-between',
    backgroundColor: `#111111`,
  },
  shortDescription: {
    // paddingVertical: 10,
    // paddingTop: 15,
    color: 'white',
  },
  list: {
    // margin: 20,
  },
  arButton: {
    marginVertical: 5,
    marginHorizontal: 20,
    textColor: 'white',
    backgroundColor: '#FFCC33',
  },
  bodyText: {
    color: 'white',
    // marginTop: 10,
    // paddingTop: 10,
    paddingHorizontal: 10,
    textAlign: 'justify',
  },

  titleText: {
    color: 'gold',
    marginTop: 10,
    fontSize: 16,
  },

  audioContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    backgroundColor: '#f57c00',
  }
});
