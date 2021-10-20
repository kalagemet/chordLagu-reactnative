import firestore from '@react-native-firebase/firestore';

export async function getCategories(statusRetreived) {
  
  var snapshot = await firestore()
    .collection('category')
    .doc('charts')
    .get()


  statusRetreived(snapshot.data());
}

export async function getCategory(category, songsRetreived) {

  var songList = [];

  await firestore()
    .collection("category").doc("charts").collection(category).get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        const songItem = doc.data();
        songList.push(songItem);
      });
      songsRetreived(songList);
    });
}