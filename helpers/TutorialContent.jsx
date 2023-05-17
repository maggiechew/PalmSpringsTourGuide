import { View, Text, Image } from 'react-native';
import { db } from '../config';
import React, { useContext, useEffect } from 'react';
import { AuthenticatedUserContext } from '../providers';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { StyleSheetContext } from '../providers/StyleSheetProvider';

const TutorialContent = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const userID = user.uid;

  useEffect(() => {
    const checkUserTutorial = async () => {
      await updateDoc(doc(db, 'users', userID), {
        seenTutorial: true
      });
    };
    if (user) {
      checkUserTutorial();
    }
  }, []);

  const styles = useContext(StyleSheetContext);
  return (
    <View>
      <Text style={styles.tutorialTitle}>Welcome to Palm Springs Tour Guide!</Text>
      <Text style={styles.tutorialText}>
        Use the map to find hidden "site zones" all around the area...
      </Text>
      <Text style={styles.tutorialText}>Happy hunting!</Text>
    </View>
  );
};

export default TutorialContent;