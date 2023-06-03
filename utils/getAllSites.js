import { collection, getDocs } from 'firebase/firestore';

import { db } from '../config';

export const getAllSites = async () => {
  const querySnapshot = await getDocs(collection(db, 'sites'));
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, ' => ', doc.data());
//   });
  const data = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  //   snapshot.forEach((doc) => {
  //     console.log(doc.id, '=>', doc.data());
  //   });

  //   const q = query(collection(db, 'sites'), where('zone', '==', zone.id));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {});

  //   const data = querySnapshot.docs.map((doc) => {
  //     return {
  //       id: doc.id,
  //       ...doc.data(),
  //     };
  //   });
  // console.log('ALL DATA IS', data);
  return data;
};
