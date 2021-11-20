import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  ToastAndroid,
} from "react-native";
import ViewChord from "./ViewChord";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import InputText from "./InputText";
import Button from "./Button";
import messaging from "@react-native-firebase/messaging";
import { addRequestList } from "../api/SongsApi";
import { sendNotificationRequestToAdmin } from "../api/NotificationApi";

export default function RequestModal({ show, closeModal, email }) {
  const { colors } = useTheme();
  const [judul, setJudul] = useState("");
  const [namaBand, setNamaBand] = useState("");

  const postRequest = async () => {
    if (judul == "" || namaBand == "") {
      ToastAndroid.showWithGravity(
        "Judul dan artist tidak boleh kosong",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    } else {
      const fcmToken = await messaging().getToken();
      let request = {
        nama_band: namaBand,
        judul: judul,
        waktu: new Date(),
        token: fcmToken,
        user: email,
        done: false,
      };
      addRequestList(request, () => {
        sendNotificationRequestToAdmin(namaBand+" - "+judul, ()=>{
          ToastAndroid.showWithGravityAndOffset(
            "Berhasil, Request akan segera diproses",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }, () => {
          ToastAndroid.showWithGravityAndOffset(
            "Terjadi kesalahan, request gagal",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        })
      });
      closeModal();
    }
  };

  return (
    <Modal transparent={true} animationType={"none"} visible={show}>
      <View style={styles.modalBackground}>
        <View
          style={{
            ...styles.activityIndicatorWrapper,
            backgroundColor: colors.background,
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              marginVertical: "5%",
              alignSelf: "center",
              color: colors.text,
              fontSize: 20,
            }}
          >
            Request Chord
          </Text>
          <View style={{ flex: 3 }}>
            <InputText
              name="Nama Artist"
              onChangeText={(text) => setNamaBand(text)}
              height={45}
            />
            <InputText
              name="Judul Lagu"
              onChangeText={(text) => setJudul(text)}
              height={45}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 10,
              alignItems: "center",
              alignSelf: "flex-end",
              padding: "5%",
            }}
          >
            <Text
              onPress={closeModal}
              style={{
                marginHorizontal: "10%",
                fontSize: 15,
                color: colors.text,
              }}
            >
              Batal
            </Text>
            <Button name="Request" height="90%" onPress={postRequest} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#000000e7",
  },
  activityIndicatorWrapper: {
    height: 250,
    width: 350,
    borderRadius: 10,
  },
});
