import {
  Layout,
  TopNavigation,
  Text,
  Icon,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AdMobBanner } from "react-native-admob";
import { goBack } from "../RootNavigation";

const icon = (props) => (
  <Icon {...props} size="big" name="arrow-ios-back-outline" />
);

export default class Tentang extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Layout level="1">
          <TopNavigation
            accessoryLeft={() => (
              <TopNavigationAction onPress={() => goBack()} icon={icon} />
            )}
            style={styles.topNavigation}
            alignment="start"
            title={() => (
              <Text style={styles.headerText} category="h6">
                Tentang Aplikasi
              </Text>
            )}
          />
        </Layout>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Layout style={styles.content} level="2">
            <Text status="success">Versi : 1.0.0 beta</Text>
            <Text> </Text>
            <Text>==================</Text>
            <Text status="success">Aplikasi Chord Lagu</Text>
            <Text>==================</Text>
            <Text appearance="hint" style={{ textAlign: "justify" }}>
              {" "}
              Adalah sebuah aplikasi yang menmpilkan Chord (Lirik Lagu beserta
              Kunci nada) yang di desain khusus untuk anda yang hobi bernyanyi
              baik dengan alat musik maupun tanpa alat musik
            </Text>
            <Text> </Text>
            <Text>==================</Text>
            <Text status="success">Change log versi</Text>
            <Text>==================</Text>
            <Text appearance="hint">
              - Release Aplikasi{"\n"}- Fitur :{"\n "}# Lihat Lirik dan Kunci
              lagu
              {"\n "}# Capo Up dan Capo Down Kunci{"\n "}# Simpan/Hapus Lagu
              (Offline){"\n "}# Dark Mode / Light Mode{"\n "}# Auto Scroll
              reading{"\n "}# dan lainnya
            </Text>
            <Text> </Text>
            <Text status="success">==</Text>
            <Text></Text>
          </Layout>
        </ScrollView>
        <Layout
          style={{
            // flex: 1,
            position: "absolute",
            alignItems: "center",
            width: "100%",
            bottom: 0,
            elevation: 40,
          }}
          level="2"
        >
          <AdMobBanner
            adSize="largeBanner"
            adUnitID="ca-app-pub-1690523413615203/8408167938"
          />
        </Layout>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  topNavigation: {
    // flex: 1,
  },
  headerText: {},
  content: {
    flex: 1,
    padding: 30,
    alignItems: "center",
  },
});
