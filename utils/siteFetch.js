import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../config';

export const siteTotalFetch = async () => {
  const coll = collection(db, 'sites');
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};
