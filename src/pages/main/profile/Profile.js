import React, { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { getAdStatus } from "../../../api/AdsApi";
import * as STORAGE from "../../../Storage";
import { BannerAd, BannerAdSize, TestIds } from "@react-native-firebase/admob";
import Button from "../../../components/Button";
import { useTheme } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RequestModal from "../../../components/RequestModal";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-7469495811267533/3071883640";
export default function Profile({ navigation }) {
  const { colors } = useTheme();
  const [showAds, setShowAds] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [numNotification, setNumNotification] = useState(0);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAdStatus((adStatus) => {
        setShowAds(adStatus.profileBannerAd);
      });

      STORAGE.getUserInfo((data) => {
        data && setUserData(data);
      });

      STORAGE.getNumberOfUnreadNotification((num) => setNumNotification(num));
    });
    return unsubscribe;
  }, [navigation]);

  const toMakeSong = () => {
    navigation.navigate("MakeSong");
  };

  const toMyChords = () => {
    navigation.navigate("MyChords", {
      user: userData.email ? userData.email : "",
    });
  };

  const requestModalChange = () => {
    setShowRequest(!showRequest);
  };

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      <RequestModal
        show={showRequest}
        closeModal={requestModalChange}
        email={userData.email ? userData.email : ""}
      />
      <View
        style={{
          ...styles.HeaderContainer,
          backgroundColor: colors.background,
        }}
      >
        <TouchableOpacity
          style={{
            ...styles.badgeIconView,
            padding: numNotification > 0 ? 5 : 0,
          }}
          onPress={() => navigation.navigate("Notifications")}
        >
          {numNotification > 0 && (
            <Text
              style={{ ...styles.badge, backgroundColor: colors.notification }}
            >
              {numNotification}
            </Text>
          )}
          <Ionicons
            name="notifications-outline"
            style={{ color: colors.text, fontSize: 25, alignSelf: "flex-end" }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {userData.photoURL ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                  source={{ uri: userData.photoURL }}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 40,
                    borderColor: colors.text,
                    borderWidth: 2,
                  }}
                />
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>
                  {userData.displayName}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{ color: colors.text, fontSize: 13 }}
                >
                  {userData.email}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {userData.email}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.ListContainer}>
        {userData.email ? (
          <View style={{ flex: 1 }}>
            <Button
              name="Tulis Chord"
              onPress={toMakeSong}
              icon="create-outline"
              height="11%"
            />
            <Button
              name="Chord Saya"
              onPress={toMyChords}
              icon="file-tray-full-outline"
              height="11%"
            />
            <Button
              name="Request Chord"
              onPress={requestModalChange}
              icon="chatbubble-outline"
              height="11%"
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Button
              name="Login"
              onPress={() => navigation.navigate("Login")}
              icon="log-in-outline"
              height="11%"
            />
            <Button
              name="Request Chord"
              onPress={requestModalChange}
              icon="chatbubble-outline"
              height="11%"
            />
          </View>
        )}
      </View>
      {showAds ? (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.SMART_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(error) => console.log(error)}
        />
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    flex: 2,
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    padding: "5%",
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    marginBottom: "5%",
    elevation: 10,
  },
  ListContainer: {
    flex: 6,
    paddingHorizontal: "5%",
  },
  badgeIconView: {
    position: "relative",
  },
  badge: {
    color: "#fff",
    position: "absolute",
    zIndex: 10,
    top: 1,
    right: 1,
    padding: 1,
    borderRadius: 10,
    fontSize: 10,
    height: "65%",
    aspectRatio: 1,
    textAlign: "center",
  },
});
