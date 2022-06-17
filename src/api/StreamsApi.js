import axios from "axios";
import { ToastAndroid } from "react-native";
import firestore from "@react-native-firebase/firestore";
import api from "./api";

export async function getStreamsBySearch(search, streamsRetreived) {
  let limit = await firestore().collection("settings").doc("setting").get();

  let clientId = await firestore().collection("settings").doc("setting").get();

  axios
    .get("https://api-v2.soundcloud.com/search/tracks", {
      params: {
        q: search,
        client_id: clientId.data().clientId,
        limit: limit.data().soundcloudListLimit,
      },
    })
    .then((res) => {
      streamsRetreived(res.data);
    })
    .catch((error) => {
      ToastAndroid.showWithGravityAndOffset(
        "Terjadi kesalahan saat mengambil data",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      if (error.response.status === 401) {
        api.get("clientId").then((res) => updateClientId(res.data));
      }
    });
}

const updateClientId = (cid) =>
  firestore().collection("settings").doc("setting").update({ clientId: cid });
