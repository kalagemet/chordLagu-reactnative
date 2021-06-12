import firestore from '@react-native-firebase/firestore';

export async function getAdStatus(statusRetreived) {
  
    var snapshot = await firestore()
      .collection('ads')
      .doc('ad')
      .get()

  
    statusRetreived(snapshot.data());
}