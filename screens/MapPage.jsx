import * as Location from 'expo-location';
import { isPointInPolygon, isPointWithinRadius } from 'geolib';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import MapView from 'react-native-maps';
import { Avatar } from 'react-native-paper';
import AvatarMenu from '../components/AvatarMenu';
import { Markers } from '../components/Markers';
import { useSiteUserContext } from '../providers/SiteSoundProvider';
// import { zonesFromDB } from '../utils/geopoints';
import AudioSheet from '../components/AudioSheet';
import MessagingModal from '../components/MessagingModal';
// import { Zones } from '../components/Zones';
import { AuthenticatedUserContext } from '../providers';
import { siteTotalFetch } from '../utils/siteFetch';
import { getGeoSitePoints } from '../utils/geoSitePoints';
import { mapStyle } from '../components/MapStyle';
import { getAllSites } from '../utils/getAllSites';
// import { View, Text } from 'react-native'
// import React from 'react'

const MapPage = ({ navigation, children }) => {
  // const [arrayOfZones, setArrayOfZones] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const isFocused = useIsFocused();

  const {
    setCurrentSite,
    currentSite,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    sound,
    setSound,
  } = useSiteUserContext();
  //   MODAL STATES: enterZone, tutorial, newSite

  const [activeZone, setActiveZone] = useState(null);
  const [location, setLocation] = useState(null);
  const [sitesInRange, setSitesInRange] = useState();
  // const [zoneSites, setZoneSites] = useState();
  const [allSites, setAllSites] = useState();
  const [userStats, setUserStats] = useState({});
  const authContext = useContext(AuthenticatedUserContext);
  const { userInfo, user } = authContext;
  // const userID = user.uid;

  const defaultPicture = require('../assets/defaultavatar.jpg');

  

  async function changeScreenOrientation() {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }

  useEffect(() => {
    if (isFocused) {
      changeScreenOrientation();
    }
  }, [isFocused]);

  useEffect(() => {
    async function _getSites() {
      // const zones = await zonesFromDB();
      const allSites = await getAllSites();
      setAllSites(allSites);
      // setArrayOfZones(zones);
    }

    async function _getSiteTotal() {
      const sites = await siteTotalFetch();
      setUserStats({ ...userStats, everySite: sites });
    }

    _getSites();
    _getSiteTotal();
  }, []);

  useEffect(() => {
    if (userInfo) {
      if (!userInfo.seenTutorial) {
        setModalType('tutorial');
        setShowMenu(false);
        setShowModal(true);
      }
    }
  }, [userInfo]);

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const getForegroundPermission = async () => {
      let status = await Location.requestForegroundPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          'Permission to access location was denied',
          'Permissions are required to use this app! To turn location on, go to the App Settings from your phone menu.'
        );
        return;
      }
    };
    getForegroundPermission();
  }, []);

  useEffect(() => {
    // if (arrayOfZones == null) return;
    // no-op subscription. in case not successful
    let subscription = { remove: () => {} };

    // subscribe async function
    const subscribe = async () => {
      return await Location.watchPositionAsync(
        { accuracy: Location.LocationAccuracy.Highest, distanceInterval: 2 },
        (newLocation) => {
          setLocation(newLocation);

          // const usersZone = arrayOfZones.find((zone) =>
          //   isPointInPolygon(
          //     {
          //       latitude: newLocation.coords.latitude,
          //       longitude: newLocation.coords.longitude,
          //     },
          //     zone.geopoints
          //   )
          // );

          // const determineZone = () => {
          //   if (activeZone !== usersZone) {
          //     if (usersZone === undefined) {
          //       setActiveZone(null);
          //       setCurrentSite(null);
          //     } else {
          //       setActiveZone(usersZone);
          //       if (modalType !== 'enterZone' && modalType !== 'tutorial') {
          //         setModalType('enterZone');
          //       }
          //     }
          //   }
          // };
          // determineZone();
        }
      );
    };

    // return subscription promise
    subscribe()
      .then((result) => (subscription = result))
      .catch((err) => console.warn(err));

    // return remove function for cleanup
    return subscription.remove;
  }, [allSites]);

  useEffect(() => {
    if (activeZone) {
      _getSiteTotal();
      setShowMenu(false);
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [activeZone]);

  useEffect(() => {
    if (allSites) {
      const isItInRadius = (site) => {
        return isPointWithinRadius(
          {
            latitude: site.geopoint.latitude,
            longitude: site.geopoint.longitude,
          },
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          site.discoveryRadius ? site.discoveryRadius : 100
        );
      };

      const replacementSites = [];
      allSites?.forEach((site) => {
        if (isItInRadius(site)) {
          replacementSites.push(site);
        }
      });
      replacementSites !== sitesInRange
        ? setSitesInRange(replacementSites)
        : null;
    }
  }, [location, allSites]);

  // useEffect(() => {
  //   async function _getTheSites() {
  //     const sites = await getGeoSitePoints(activeZone);
  //     setZoneSites(sites);
  //   }

  //   if (activeZone) {
  //     _getTheSites();
  //   } else {
  //     setZoneSites(null);
  //     setSitesInRange(null);
  //     setCurrentSite(null);

  //     setUserStats({});
  //   }
  // }, [activeZone, userInfo]);

  useEffect(() => {
    const discoveredSites = userInfo?.discoveredSites;
    const allDiscoveredSites = discoveredSites?.length || 0;

    const totalSites = userStats?.everySite;
    // let returnValue = 0;
    // const zoneSiteLength = zoneSites?.length;
    // zoneSites?.forEach((zoneSite) => {
    //   if (discoveredSites?.find((discovered) => discovered == zoneSite.id))
    //     returnValue++;
    // });
    // const percentageZoneDiscovered = Math.ceil(
    //   (returnValue / zoneSiteLength) * 100
    // );
    const percentageAllDiscovered = Math.ceil(
      (allDiscoveredSites / totalSites) * 100
    );

    const toSetStats = {
      ...userStats,
      allDiscovered: allDiscoveredSites,
      allFoundPercentage: percentageAllDiscovered,
    };
    setUserStats(toSetStats);
  }, [userInfo]);

  if (allSites == null) {
    return null;
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {location && (
        <MapView
          style={styles.map}
          showsCompass={false}
          customMapStyle={mapStyle}
          showsUserLocation
          showsMyLocationButton
          provider="google"
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {allSites?.map((site) => {
            return (
              <Markers
                key={site.id}
                allSites={allSites}
                sitesInRange={sitesInRange}
                navigation={navigation}
              />
            );
          })}
        </MapView>
      )}

      <View style={styles.avatarButtonContainer}>
        <Pressable
          onPress={() => {
            handleMenu();
          }}
        >
          <Avatar.Image
            style={[styles.avatar, { backgroundColor: `#111111` }]}
            source={
              userInfo?.avataruri == null
                ? defaultPicture
                : {
                    uri: userInfo.avataruri,
                  }
            }
          />
        </Pressable>
      </View>

      <AvatarMenu
        visible={showMenu}
        handleMenu={handleMenu}
        navigation={navigation}
        userStats={userStats}
      />

      <MessagingModal
        visible={showModal}
        userInfo={userInfo}
        stats={userStats}
        modalType={modalType}
        handleModal={handleModal}
      />

      <AudioSheet navigation />

      <StatusBar style="light" />
    </View>
  );
};

export default MapPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  avatarButtonContainer: {
    paddingLeft: 20,
    paddingTop: 20,
    zIndex: 46,
  },
  avatar: {
    borderWidth: 3,
    margin: 2,
    borderColor: 'gold',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  playButtonContainer: {
    paddingRight: 10,
    paddingBottom: 20,
    zIndex: 5,
    alignSelf: 'flex-end',
  },
  button: {
    zIndex: 45,
    paddingRight: 10,
  },
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
