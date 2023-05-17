import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { SiteUserContext } from '../providers/SiteSoundProvider';
import { StyleSheetContext } from '../providers/StyleSheetProvider';

export const SiteContent = () => {
  const { currentSite } = useContext(SiteUserContext);
  const styles = useContext(StyleSheetContext);
  const site = currentSite;
  console.log(site);

//   const LeftContent = () => (
//     <Avatar.Image size={40} source={{ uri: creator.creatorAvatarURI }} />
//   );

  return (
    <View>
      <View style={styles.card}>
        <Card mode="elevated">
          <Card.Title
            title={site.siteName}
            // subtitle={creator.creatorName}
            subtitleNumberOfLines={2}
            // left={LeftContent}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.shortDescription}>
              {site.siteBlurb}
            </Text>
            {site.siteURIs.imageURI ? (
              <Card.Cover source={{ uri: site.siteURIs.imageURI }} />
            ) : (
              <Card />
            )}
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};
