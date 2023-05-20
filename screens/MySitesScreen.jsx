import { useNavigation } from '@react-navigation/native';
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { db, Images } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { SiteUserContext } from '../providers/SiteSoundProvider';

function ImagesFavoriteSites() {
  const imgWidth = Dimensions.get('screen').width * 0.5;
  const { userInfo } = useContext(AuthenticatedUserContext);
  const { setCurrentSite } = useContext(SiteUserContext);
  const userFavoriteSites = userInfo.favoriteSites;
  const navigation = useNavigation();

  const [likedSiteInfo, setLikedSiteInfo] = useState(null);

  useEffect(() => {
    if (userFavoriteSites && userFavoriteSites.length > 0) {
      const getLikedSitesInfo = async () => {
        const q = query(
          collection(db, 'sites'),
          where(documentId(), 'in', userFavoriteSites)
        );
        const querySnapshot = await getDocs(q);
        const likedSitesInfo = [];
        querySnapshot.forEach((doc) => {
          likedSitesInfo.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setLikedSiteInfo(likedSitesInfo);
      };
      getLikedSitesInfo();
    } else {
      setLikedSiteInfo([]);
    }
  }, [userFavoriteSites]);

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {likedSiteInfo?.map((site, index) => (
          <TouchableHighlight
            key={index}
            onPress={async () => {
              setCurrentSite(site);
              navigation.navigate('Content', { fromMySites: true });
            }}
          >
            <Image
              style={{ width: imgWidth, height: imgWidth }}
              source={
                site.siteURIs?.imageURIs
                  ? { uri: site.siteURIs.imageURIs[0].URI }
                  : require('../assets/defaultavatar.jpg')
              }
            />
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
}

function ImagesDiscoveredSites() {
  const imgWidth = Dimensions.get('screen').width * 0.5;
  const { userInfo } = useContext(AuthenticatedUserContext);
  const userDiscoveredSites = userInfo.discoveredSites;
  const [discoverSitesInfo, setDiscoverSitesInfo] = useState(null);

  useEffect(() => {
    if (userDiscoveredSites && userDiscoveredSites.length > 0) {
      const getDiscoverdSitesInfo = async () => {
        const q = query(
          collection(db, 'sites'),
          where(documentId(), 'in', userDiscoveredSites)
        );
        const querySnapshot = await getDocs(q);
        const discoverdSitesInfo = [];
        querySnapshot.forEach((doc) => {
          discoverdSitesInfo.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setDiscoverSitesInfo(discoverdSitesInfo);
      };
      getDiscoverdSitesInfo();
    } else {
      setDiscoverSitesInfo([]);
    }
  }, [userDiscoveredSites]);

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {discoverSitesInfo?.map((site, index) => (
          <TouchableHighlight
            key={index}
            onPress={() => {
              Alert.alert(
                'This site has only been discovered!\nLike this site to save it for later'
              );
            }}
          >
            <>
              <Image
                style={{
                  width: imgWidth,
                  height: imgWidth,
                  tintColor: '#616161',
                }}
                source={
                  site.siteURIs?.imageURIs
                    ? { uri: site.siteURIs.imageURIs[0].URI }
                    : require('../assets/defaultavatar.jpg')
                }
              />

              <Image
                style={{
                  width: imgWidth,
                  height: imgWidth,
                  position: 'absolute',
                  opacity: 0.2,
                }}
                source={
                  site.siteURIs?.imageURIs
                    ? { uri: site.siteURIs.imageURIs[0].URI }
                    : require('../assets/defaultavatar.jpg')
                }
              />
            </>
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
}

export const MySitesScreen = () => {
  const authContext = useContext(AuthenticatedUserContext);
  const { userInfo } = authContext;
  const [showContent, setShowContent] = useState('ImagesFavoriteSites');

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <>
          <View>
            <Image
              style={styles.coverImage}
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/hello-calgary-86156.appspot.com/o/photo%2FCalgary-1.png?alt=media&token=8c091175-62a8-46b6-a224-9bdfba2c736b',
              }}
            />
          </View>
          <View style={styles.profileContainer}>
            <View>
              <View style={styles.profileImageView}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: userInfo.avataruri }}
                />
              </View>
              {/* User NAME */}
              <View>
                <Text style={styles.name}>
                  {userInfo.firstname} {userInfo.lastname}
                </Text>
              </View>
              {/* test */}
              <View style={styles.interactButtonsView}>
                <TouchableOpacity
                  style={{
                    ...styles.interactButton,
                    backgroundColor: `#111111`,
                    borderWidth: 2,
                    borderColor: 'white',
                  }}
                  onPress={() => setShowContent('ImagesFavoriteSites')}
                >
                  <Text
                    style={{
                      ...styles.interactButtonText,
                      color:
                        showContent === 'ImagesFavoriteSites'
                          ? 'gold'
                          : 'orange',
                      fontFamily:
                        showContent === 'ImagesFavoriteSites'
                          ? 'RWBold'
                          : 'RWRegular',
                      fontSize: 18,
                    }}
                  >
                    LIKED: {userInfo?.favoriteSites?.length || 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.interactButton,
                    backgroundColor: `#111111`,
                    borderWidth: 2,
                    borderColor: 'white',
                  }}
                  onPress={() => setShowContent('ImagesDiscoveredSites')}
                >
                  <Text
                    style={{
                      ...styles.interactButtonText,
                      color:
                        showContent === 'ImagesDiscoveredSites'
                          ? 'gold'
                          : 'orange',
                      fontFamily:
                        showContent === 'ImagesDiscoveredSites'
                          ? 'RWBold'
                          : 'RWRegular',
                      fontSize: 18,
                    }}
                  >
                    DISCOVERED: {userInfo?.discoveredSites?.length || 0}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* end of test */}
            </View>
            {/* border */}
            <View
              style={{
                borderBottomColor: 'white',
                borderBottomWidth: 1,
                marginTop: 10,
              }}
            />

            {/* Audio Images View */}
            <View style={{ marginTop: 20 }}>
              {showContent === 'ImagesFavoriteSites' ? (
                <ImagesFavoriteSites />
              ) : (
                <ImagesDiscoveredSites />
              )}
            </View>
          </View>
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `#111111`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    backgroundColor: `#111111`,
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  coverImage: { height: 200, width: Dimensions.get('window').width },
  profileImageView: { alignItems: 'center', marginTop: -50 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
  },
  countsView: { flexDirection: 'row', marginTop: 20 },
  countView: { flex: 1, alignItems: 'center' },
  countNum: { fontFamily: 'RWBold', fontSize: 20, color: 'gold' },
  countText: { fontFamily: 'RWRegular', fontSize: 18, color: 'gold' },
  profileContentButtonsView: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#f1f3f6',
  },
  showContentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#000',
  },
  name: {
    fontFamily: 'RWBold',
    fontSize: 20,
    color: 'gold',
    marginTop: 10,
    textAlign: 'center',
  },
  interactButtonsView: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  interactButton: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 4,
  },
  interactButtonText: {
    fontFamily: 'RWBold',
    fontSize: 18,
    paddingVertical: 6,
  },
});
