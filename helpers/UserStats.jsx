import { View, Text } from 'react-native';
import React, { useContext } from 'react';


import { StyleSheetContext } from '../providers/StyleSheetProvider';

export const UserStats = (stats) => {
  const styles = useContext(StyleSheetContext);

  if (stats.zoneFoundPercentage) {
    let discoveredSites = stats.zoneFoundPercentage
    let undiscovered = 100 - discoveredSites;
if (undiscovered === 0) {
  return ( <View>
  <Text style={styles.tutorialTitle}>Welcome to this zone!</Text>
  <Text style={styles.tutorialText}>
    You have discovered all of this zone's sites!
  </Text>
  <Text style={styles.tutorialText}>
    Well done, you!{' '}
  </Text>
</View>)
}
    return (
      <View>
        <Text style={styles.tutorialTitle}>Welcome to this zone!</Text>
        <Text style={styles.tutorialText}>
          You have discovered {discoveredSites}% of this zone's sites
        </Text>
        <Text style={styles.tutorialText}>
          There are {undiscovered}% still to discover!{' '}
        </Text>
      </View>
    );
  } else {
    return (
      <View>
        <Text style={styles.tutorialTitle}>Welcome to this zone!</Text>
        <Text style={styles.tutorialText}>
          You haven't discovered any sites here... yet!
        </Text>
        <Text style={styles.tutorialText}>
          So much left to discover :)
        </Text>
      </View>
    );
  }
};