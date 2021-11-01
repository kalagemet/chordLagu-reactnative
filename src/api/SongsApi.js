import firestore from '@react-native-firebase/firestore';

export async function getTopLikes(songsRetreived) {

  var songList = [];

  var snapshot = await firestore()
    .collection('songs')
    .orderBy('favourites','DESC')
    .limit(20)
    .get()

  snapshot.forEach((doc) => {
    const songItem = doc.data();
    songItem.id = doc.id;
    songList.push(songItem);
  });

  songsRetreived(songList);
}

export async function getSongs(user, songsRetreived) {

    var songList = [];
  
    var snapshot = await firestore()
      .collection('songs')
      .where('created_by', '==', user)
      .get()

    snapshot.forEach((doc) => {
      const songItem = doc.data();
      songItem.id = doc.id;
      songList.push(songItem);
    });
  
    songList = songList.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    songsRetreived(songList);
}

export async function getAllSongs(startcode, endcode, songsRetreived) {

  var songList = [];

  var snapshot = await firestore()
    .collection('songs')
    .where('title', '>=', startcode)
    .where('title', '<', endcode)
    .get()

  var snapshot2 = await firestore()
    .collection('songs')
    .where('artist', '>=', startcode)
    .where('artist', '<', endcode)
    .get()

  snapshot.forEach((doc) => {
    const songItem = doc.data();
    songItem.id = doc.id;
    songList.push(songItem);
  });

  snapshot2.forEach((doc) => {
    const songItem = doc.data();
    songItem.id = doc.id;
    songList.push(songItem);
  });

  songList = songList.reduce((unique, o) => {
      if(!unique.some(obj => obj.id === o.id )) {
        unique.push(o);
      }
      return unique;
  },[]);

  songList = songList.sort((a, b) => parseFloat(b.favourites) - parseFloat(a.favourites));

  songsRetreived(songList);
}

export async function getSong(songId, songsRetreived) {
  
    var snapshot = await firestore()
      .collection('songs')
      .doc(songId)
      .get()

  
    songsRetreived(snapshot.data());
}

export function addSong(song, addComplete) {

  firestore()
    .collection('songs')
    .add(song)
    .then((snapshot) => {
      snapshot.set(song);
    }).then(() => addComplete(song))
    .catch((error) => console.log(error));
}

export async function addChordPro(song, addComplete) {
  var getSong = await firestore()
  .collection('songs')
  .where('path', '==', song.path)
  .get()

  if(!getSong){
    firestore()
      .collection('songs')
      .add(song)
      .then((snapshot) => {
        snapshot.set(song);
      }).then(() => addComplete(song))
      .catch((error) => console.log(error));
  }
}

export function updateSong(songId, song, updateComplete) {
  console.log("Updating song in firebase");

  firestore()
    .collection('songs')
    .doc(songId).update(song)
    .then(() => updateComplete())
    .catch((error) => console.log(error));
}

export function deleteSong(songId, deleteComplete) {
  console.log(songId);

  firestore()
    .collection('songs')
    .doc(songId).delete()
    .then(() => deleteComplete())
    .catch((error) => console.log(error));
}

export function addToFavourite(favourite, favouriteComplete) {
  var likes = [];
  var song = getSong(favourite.songId, (data) => {store(data)})
  const increment = firestore.FieldValue.increment(1);

  const store = (data) => {
    //console.log(data.likes); 
    if(data.likes){
      likes = data.likes;
    }
    
    likes.push(favourite.user)
    //console.log("likes : "+likes)
    firestore()
      .collection('songs')
      .doc(favourite.songId)
      .update({likes : likes, favourites : increment})
      .then(() => favouriteComplete())
      .catch((error) => console.log(error));
  }
    
}

export async function isFavourited(songId, user, isSongFavourited) {
  var snapshot = await firestore()
      .collection('songs')
      .doc(songId)
      .get()

  var fav = false;
  if(snapshot.data().likes){
    fav = snapshot.data().likes.includes(user);
  }  

  // snapshot.forEach((doc) => {
  //   if(doc.id == songId){
  //     fav = true;
  //   }
  // });
  
  isSongFavourited(fav);
}

export function removeFavourite(userId, songId, favRemoveComplete) {

  var likes = [];
  var song = getSong(songId, (data) => {store(data)})
  const decrement = firestore.FieldValue.increment(-1);

  const store = (data) => {
    //console.log(data.likes); 
    likes = data.likes;
    const index = likes.indexOf(userId);
    if (index > -1) {
      likes.splice(index, 1);
    }
    //console.log("likes : "+likes)
    firestore()
      .collection('songs')
      .doc(songId)
      .update({likes : likes, favourites: decrement})
      .then(() => favRemoveComplete())
      .catch((error) => console.log(error));
  }
    
}

export async function getFavourited(user, songsRetreived) {

  var songList = [];

  var snapshot = await firestore()
      .collection('songs')
      .where('likes', 'array-contains', user)
      .get()

  snapshot.forEach((doc) => {
    const songItem = doc.data();
    songItem.id = doc.id;
    songList.push(songItem);
  });

  songsRetreived(songList);
}

export function addSearchList(search, addComplete) {

  firestore()
    .collection('search')
    .add(search)
    .then((snapshot) => {
      snapshot.set(search);
    }).then(() => addComplete())
    .catch((error) => console.log(error));
}