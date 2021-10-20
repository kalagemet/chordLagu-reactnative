import firestore from '@react-native-firebase/firestore';

export async function getAdStatus(statusRetreived) {
  
    var snapshot = await firestore()
      .collection('ads')
      .doc('ad')
      .get()

  
    statusRetreived(snapshot.data());
}

export async function getSettings(statusRetreived) {
  var snapshot = await firestore()
    .collection('ads')
    .doc('settings')
    .get()

  statusRetreived(snapshot.data());
}