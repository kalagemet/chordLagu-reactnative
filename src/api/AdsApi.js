import firestore from '@react-native-firebase/firestore';

export async function getAdStatus(statusRetreived) {
  
    var snapshot = await firestore()
      .collection('settings')
      .doc('setting')
      .get()

  
    statusRetreived(snapshot.data());
}

export async function getSettings(statusRetreived) {
  var snapshot = await firestore()
    .collection('settings')
    .doc('setting')
    .get()

  statusRetreived(snapshot.data());
}