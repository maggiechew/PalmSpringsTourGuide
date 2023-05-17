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
import MapView from 'react-native-maps';
import { Avatar } from 'react-native-paper';
import AvatarMenu from '../components/AvatarMenu';
import { Markers } from '../components/Markers';
import { useSiteUserContext } from '../providers/SiteSoundProvider';
import { zonesFromDB } from '../utils/geopoints';
import AudioSheet from '../components/AudioSheet';
import MessagingModal from '../components/MessagingModal';
import { Zones } from '../components/Zones';
import { AuthenticatedUserContext } from '../providers';
import { siteTotalFetch } from '../utils/siteFetch';
import { getGeoSitePoints } from '../utils/geoSitePoints';
import { mapStyle } from '../components/MapStyle';
// import { View, Text } from 'react-native'
// import React from 'react'

const MapPage = ({ navigation, children }) => {
  const [arrayOfZones, setArrayOfZones] = useState();
  const [showMenu, setShowMenu] = useState(false);

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
  const [zoneSites, setZoneSites] = useState();
  const [userStats, setUserStats] = useState({});
  const authContext = useContext(AuthenticatedUserContext);
  const { userInfo, user } = authContext;
  const userID = user.uid;

  const defaultPicture = require('../assets/defaultavatar.jpg');

  async function _getSiteTotal() {
    const sites = await siteTotalFetch();
    setUserStats({ ...userStats, everySite: sites });
  }

  useEffect(() => {
    async function _getZones() {
      const zones = await zonesFromDB();
      // console.log(zones);
      setArrayOfZones(zones);
    }

    _getZones();
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
    if (arrayOfZones == null) return;
    // no-op subscription. in case not successful
    let subscription = { remove: () => {} };

    // subscribe async function
    const subscribe = async () => {
      return await Location.watchPositionAsync(
        { accuracy: Location.LocationAccuracy.Highest, distanceInterval: 2 },
        (newLocation) => {
          setLocation(newLocation);

          const usersZone = arrayOfZones.find((zone) =>
            isPointInPolygon(
              {
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
              },
              zone.geopoints
            )
          );

          const determineZone = () => {
            if (activeZone !== usersZone) {
              if (usersZone === undefined) {
                setActiveZone(null);
                setCurrentSite(null);
              } else {
                setActiveZone(usersZone);
                if (modalType !== 'enterZone' && modalType !== 'tutorial') {
                  setModalType('enterZone');
                }
              }
            }
          };
          determineZone();
        }
      );
    };

    // return subscription promise
    subscribe()
      .then((result) => (subscription = result))
      .catch((err) => console.warn(err));

    // return remove function for cleanup
    return subscription.remove;
  }, [arrayOfZones]);

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
    if (zoneSites) {
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
      zoneSites?.forEach((site) => {
        if (isItInRadius(site)) {
          replacementSites.push(site);
        }
      });
      replacementSites !== sitesInRange
        ? setSitesInRange(replacementSites)
        : null;
    }
  }, [location, zoneSites]);

  useEffect(() => {
    async function _getTheSites() {
      const sites = await getGeoSitePoints(activeZone);
      setZoneSites(sites);
    }

    if (activeZone) {
      _getTheSites();
    } else {
      setZoneSites(null);
      setSitesInRange(null);
      setCurrentSite(null);

      setUserStats({});
    }
  }, [activeZone, userInfo]);

  useEffect(() => {
    const discoveredSites = userInfo?.discoveredSites;
    const allDiscoveredSites = discoveredSites?.length || 0;

    const totalSites = userStats?.everySite;
    let returnValue = 0;
    const zoneSiteLength = zoneSites?.length;
    zoneSites?.forEach((zoneSite) => {
      if (discoveredSites?.find((discovered) => discovered == zoneSite.id))
        returnValue++;
    });
    const percentageZoneDiscovered = Math.ceil(
      (returnValue / zoneSiteLength) * 100
    );
    const percentageAllDiscovered = Math.ceil(
      (allDiscoveredSites / totalSites) * 100
    );

    const toSetStats = {
      ...userStats,
      zoneFoundPercentage: percentageZoneDiscovered,
      allDiscovered: allDiscoveredSites,
      allFoundPercentage: percentageAllDiscovered,
    };
    setUserStats(toSetStats);
  }, [zoneSites, userInfo]);

  if (arrayOfZones == null) {
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
          {arrayOfZones?.map((zone) => {
            if (zone?.id === activeZone?.id) {
              {/* console.log('heck ya');
              console.log(zoneSites); */}
              return (
                <Markers
                  key={zone.id}
                  zoneSites={zoneSites}
                  sitesInRange={sitesInRange}
                  navigation={navigation}
                />
              );
            } else {
              {
                /* console.log('whoops') */
              }
              return <Zones key={zone.id} zone={zone} />;
            }
          })}
          {/* {console.log('I got here')} */}
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
