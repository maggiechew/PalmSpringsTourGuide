import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { Marker } from 'react-native-maps';
import { IconButton } from 'react-native-paper';
import { db } from '../config';
import { Alert } from 'react-native';
import { AuthenticatedUserContext } from '../providers';
import { SiteUserContext } from '../providers/SiteSoundProvider';

export const Markers = ({ allSites, sitesInRange }) => {
  const { userInfo, user } = useContext(AuthenticatedUserContext);
  const userSites = userInfo.discoveredSites;
  const userID = user.uid;
  const { currentSite, setCurrentSite, setShowModal, setModalType } =
    useContext(SiteUserContext);


  const newContent = async (site) => {
    await updateDoc(doc(db, 'users', userID), {
      discoveredSites: arrayUnion(site.id)
    });
    setCurrentSite(site);
    setModalType('newSite');
    setShowModal(true);
  };

  const oldContent = async (site) => {
    if (site !== currentSite) {
      setCurrentSite(site);
      console.log('SITE IS NOW', site)
    }
  };

  const lockedContent = (site) => {
    Alert.alert(`I'm locked!`);
  };

  return allSites?.map((site) => {
    let locked = true;
    let discovered = false;
    if (sitesInRange?.find((foundSite) => foundSite.id === site.id)) locked = false;
    if (userSites?.find((foundSite) => foundSite === site.id)) discovered = true;
    return (
      <Marker
        key={`${site.id}-${locked}-${discovered}`} //required to make markers change properly (workaround) https://github.com/react-native-maps/react-native-maps/issues/1800#issuecomment-347905340
        coordinate={{
          latitude: site.geopoint.latitude,
          longitude: site.geopoint.longitude
        }}
        icon={
          locked
            ? require('../assets/red_star.png')
            : discovered
            ? require('../assets/green_star.png')
            : require('../assets/yellow_star.png')
        }
        // pinColor={locked ? 'red' : discovered ? 'gold' : 'green'}
        onPress={() =>
          locked
            ? lockedContent(site)
            : discovered
            ? oldContent(site)
            : newContent(site)
        }
      />
    );
  });
};