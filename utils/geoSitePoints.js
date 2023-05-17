import {
  getDoc,
  doc,
  getDocs,
  query,
  where,
  collection,
} from 'firebase/firestore';
import { db } from '../config';

export const getGeoSitePoints = async (zone) => {
  const q = query(collection(db, 'sites'), where('zone', '==', zone.id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {});

  const data = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return data;
};
