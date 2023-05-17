import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { Marker } from 'react-native-maps';
import { IconButton } from 'react-native-paper';
import { db } from '../config';
import { Alert } from 'react-native';
import { AuthenticatedUserContext } from '../providers';
import { SiteUserContext } from '../providers/SiteSoundProvider';

export const Markers = ({ zoneSites, sitesInRange }) => {
  const { userInfo, user } = useContext(AuthenticatedUserContext);
  const userSites = userInfo.discoveredSites;
  const userID = user.uid;
  const { currentSite, setCurrentSite, setShowModal, setModalType } =
    useContext(SiteUserContext);

  // const getCreator = async (creatorID) => {
  //   const creatorRef = doc(db, 'creators', creatorID);
  //   const docSnap = await getDoc(creatorRef);
  //   if (!docSnap.exists) {
  //     console.log('oh snap')
  //   } else {
  //     const creatorData = docSnap.data();
  //     return {
  //       creatorName: creatorData.creatorName,
  //       creatorAvatarURI: creatorData.creatorAvatarURI,
  //       creatorBlurb: creatorData.creatorBlurb
  //     };
  //   }
  // };

  const newContent = async (site) => {
    await updateDoc(doc(db, 'users', userID), {
      discoveredSites: arrayUnion(site.id)
    });
    console.log('I got here')
    // const creatorInfo = await getCreator(site.creatorID);
    // console.log("Creator Info is:", creatorInfo)
    // const combinedSite = { Site: site, Creator: creatorInfo };
    setCurrentSite(site);
    setModalType('newSite');
    setShowModal(true);
  };

  const oldContent = async (site) => {
    if (site !== currentSite) {
      // const creatorInfo = await getCreator(site.creatorID);
      // const combinedSite = { Site: site, Creator: creatorInfo };
      // setCurrentSite(combinedSite);
      setCurrentSite(site);
    }
  };

  const lockedContent = (site) => {
    Alert.alert(`I'm locked!`);
  };

  return zoneSites?.map((site) => {
    // console.log('site is', site)
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
            ? require('../assets/eggicon_locked.png')
            : discovered
            ? require('../assets/eggicon_unlocked.png')
            : require('../assets/eggicon_undiscovered.png')
        }
        // pinColor={locked ? 'red' : discovered ? 'yellow' : 'green'}
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