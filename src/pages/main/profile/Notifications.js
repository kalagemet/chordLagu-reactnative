import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as STORAGE from "../../../Storage";
import moment from "moment";
import "moment/locale/id";
import { useIsFocused, useTheme } from "@react-navigation/native";

function Notifications({ navigation }) {
  const [requestNotifications, setRequestNotifications] = useState([]);
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');

  React.useEffect(() => {
    STORAGE.getRequestNotifications((data) => {
      setRequestNotifications(data);
    });
    STORAGE.getUserInfo((data) => {
      data && data.email && setEmail(data.email);
    });
  }, [isFocused]);

  const onListItemPressed = (id, index) => {
    navigation.navigate("ViewSong", {
      id: id,
      user: email,
    });
    let readNotification = requestNotifications;
    readNotification[index].read = true;
    STORAGE.updateRequestNotification(readNotification);
  };

  const renderItem = (notif, index) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: notif.read ? colors.card : colors.notification,
          flex: 1,
          padding: "5%",
          borderBottomColor: "#ccc",
          borderBottomWidth: 0.3,
        }}
        onPress={() => onListItemPressed(notif.item_id, index)}
      >
        <Text style={{ fontSize: 15, color: colors.text }}>
          {notif.item}
        </Text>
        <Text style={{ fontSize: 13, color: colors.text }}>
          {notif.message}
        </Text>
        <Text
          style={{
            fontSize: 11,
            alignSelf: "flex-end",
            color: colors.text,
          }}
        >
          {moment(new Date(notif.timestamp)).format("LL")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              color: colors.text,
              marginLeft: "5%",
              fontSize: 25,
            }}
          >
            Notifikasi
          </Text>
        </View>
        <View style={{...styles.sectionContainer, backgroundColor: colors.card}}>
          <View
            style={{
              flexDirection: "row",
              padding: "3%",
              paddingHorizontal: "20%",
            }}
          >
          </View>
          { requestNotifications ? (
            <FlatList
              data={requestNotifications}
              renderItem={({ item, index }) => renderItem(item, index)}
              keyExtractor={(item) => item.timestamp}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.text }}>
                Tidak Ada Notifikasi
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 7,
    justifyContent: "flex-start",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  switchButton: {
    height: "10%",
    width: "20%",
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Notifications;
