import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, Linking } from "react-native";
import DeviceInfo from "react-native-device-info";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function About({ navigation }) {
  const { colors } = useTheme();
  const [androidId, setAndroidId] = useState("");

  React.useEffect(() => {
    DeviceInfo.getApiLevel().then((androidId) => {
      setAndroidId(androidId);
    });
  }, [navigation]);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "5%",
        }}
      >
        <Image
          source={require("../../../../assets/Images/chordlagu.png")}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
        <Text style={{ marginLeft: "5%", fontSize: 30, color: colors.text }}>
          ChordLagu
        </Text>
      </View>
      <View style={{ flex: 5, alignItems: "center" }}>
        <Text style={{ color: colors.text }}>
          Perangkat : {DeviceInfo.getBrand() + " " + DeviceInfo.getModel()}
        </Text>
        <Text style={{ color: colors.text }}>
          Versi Android : API {androidId}
        </Text>
        <Text style={{ color: colors.text }}>
          Versi Aplikasi : {DeviceInfo.getVersion()}
        </Text>
      </View>
      <View
        style={{
          flex: 2,
          alignItems: "center",
          flexDirection: "row",
          padding: "5%",
        }}
      >
        <TouchableOpacity
          style={{
            width: "40%",
            padding: "3%",
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            elevation: 5,
            backgroundColor: colors.background,
          }}
          onPress={() =>
            Linking.openURL("https://www.instagram.com/chrdlg/")
          }
        >
          <Ionicons size={40} name="logo-instagram" color={colors.text} />
          <Text style={{ color: colors.text }}>@chrdlg</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
