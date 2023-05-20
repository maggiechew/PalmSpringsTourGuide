import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { SiteUserContext } from '../providers/SiteSoundProvider';
import { StyleSheetContext } from '../providers/StyleSheetProvider';

export const SiteContent = () => {
  const { currentSite } = useContext(SiteUserContext);
  const styles = useContext(StyleSheetContext);

  return (
    <View>
      <View style={styles.card}>
        <Card mode="elevated">
          <Card.Title
            title={currentSite.siteName}
            subtitleNumberOfLines={2}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.shortDescription}>
              {currentSite.siteDescription}
            </Text>
            {currentSite.siteURIs.imageURIs ? (
              <Card.Cover source={{ uri: currentSite.siteURIs.imageURIs[0].URI }} />
            ) : (
              <Card />
            )}
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};
