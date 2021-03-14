import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Divider,
  Icon,
  Layout,
  ListItem,
  Spinner,
  Text,
} from "@ui-kitten/components";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { AdMobBanner } from "react-native-admob";
import { navigate } from "../RootNavigation";
import Toast from "react-native-simple-toast";

const iconRight = (props) => <Icon {...props} name="chevron-right-outline" />;
const music = (props) => <Icon {...props} name="music" />;

export default class Saved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      terakhir: [],
      simpan: [],
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      let tmp = await AsyncStorage.getItem("@terakhir");
      if (tmp != null) {
        this.setState({ terakhir: JSON.parse(tmp) });
      }
      tmp = await AsyncStorage.getItem("@chordSaved");
      if (tmp != null) {
        this.setState({ simpan: JSON.parse(tmp) });
      }
    } catch (e) {
      this.MessagesToast(e.toString());
    }
    this.setState({ loading: false });
  };

  MessagesToast = (msg) => {
    Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM, 25, 50);
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <Layout style={styles.spiner} level="2">
            <Spinner size="giant" status="primary" />
          </Layout>
        ) : (
          <Layout style={styles.content} level="2">
            <Text style={styles.listDivider} appearance="hint">
              Terakhir dilihat
            </Text>
            {this.state.terakhir.length > 0 ? (
              <View>
                {this.state.terakhir.map((d, i) => {
                  return (
                    <View key={i}>
                      <ListItem
                        onPress={() =>
                          navigate("chordView", {
                            id: d.id,
                            judul: d.judul,
                            band: d.nama_band,
                          })
                        }
                        accessoryRight={iconRight}
                        accessoryLeft={music}
                        title={d.judul}
                        description={d.nama_band}
                      />
                      <Divider />
                    </View>
                  );
                })}
                <Layout
                  style={{
                    alignItems: "center",
                    paddingVertical: 20,
                  }}
                  level="2"
                >
                  <AdMobBanner
                    adSize="smartBanner"
                    adUnitID="ca-app-pub-1690523413615203/6125866944"
                  />
                </Layout>
              </View>
            ) : (
              <Layout style={styles.spiner} level="2">
                <Text appearance="hint" category="h5">
                  Tidak Tersedia
                </Text>
              </Layout>
            )}
            <Text style={styles.listDivider} appearance="hint">
              Chord disimpan
            </Text>
            {this.state.simpan.length > 0 ? (
              this.state.simpan.map((d, i) => {
                return (
                  <View key={i}>
                    <ListItem
                      onPress={() =>
                        navigate("chordView", {
                          id: d.id,
                          judul: d.judul,
                          band: d.nama_band,
                        })
                      }
                      accessoryRight={iconRight}
                      accessoryLeft={music}
                      title={d.judul}
                      description={d.nama_band}
                    />
                    <Divider />
                  </View>
                );
              })
            ) : (
              <Layout style={styles.spiner} level="2">
                <Text appearance="hint" category="h5">
                  Tidak Tersedia
                </Text>
              </Layout>
            )}
          </Layout>
        )}
        <Layout
          style={{
            paddingTop: 20,
            alignItems: "center",
          }}
          level="2"
        >
          <AdMobBanner
            adSize="mediumRectangle"
            adUnitID="ca-app-pub-1690523413615203/2186621936"
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
  content: {
    flex: 1,
  },
  spiner: {
    // flex: 1,
    height: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  listDivider: {
    padding: 15,
  },
});
