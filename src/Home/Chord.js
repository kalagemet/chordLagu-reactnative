import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
  Icon,
  ButtonGroup,
  Button,
  Spinner,
  Divider,
  ListItem,
} from "@ui-kitten/components";
import React, { Component } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import HTMLView from "react-native-htmlview";
import IdleTimerManager from "react-native-idle-timer";
import { decode } from "../decode";
import { goBack, navigate } from "../RootNavigation";
import { chordLagu, laguTerkait } from "../var";
import { capoDown, capoUp } from "../capo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdMobBanner, AdMobInterstitial } from "react-native-admob";
import Toast from "react-native-simple-toast";

const icon = (props) => (
  <Icon {...props} size="big" name="arrow-ios-back-outline" />
);
const music = (props) => <Icon {...props} name="music" />;
const reload = (props) => <Icon {...props} name="refresh" />;
const iconRight2 = (props) => <Icon {...props} name="chevron-right-outline" />;

export default class ChordView extends Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this._interfal = null;
    this.state = {
      loading: true,
      scroll: false,
      speed: 5,
      scrollHeight: 0,
      currentHeight: 0,
      data: "",
      dataTerkait: [],
      err: false,
      errTerkait: false,
      color: "black",
      fontSize: 16,
      offline: false,
    };
  }

  componentDidMount() {
    this.getStorage();
    this.onLoad();
    IdleTimerManager.setIdleTimerDisabled(true);

    AdMobInterstitial.setAdUnitID("ca-app-pub-1690523413615203/6864233540");
    // AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
    AdMobInterstitial.requestAd().catch((e) => {
      this.MessagesToast(e.toString());
    });
    AdMobInterstitial.addEventListener("adClosed", () => {
      this.saveChord();
    });
  }

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
    IdleTimerManager.setIdleTimerDisabled(false);
    clearInterval(this._interfal);
  }

  forceUpdateHandler() {
    this.setState(
      {
        loading: true,
        scroll: false,
        scrollHeight: 0,
        currentHeight: 0,
        data: "",
        dataTerkait: "",
        err: false,
        errTerkait: false,
      },
      () => {
        this.getStorage();
        this.onLoad();
        AdMobInterstitial.requestAd();
      }
    );
  }

  MessagesToast = (msg) => {
    Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM, 25, 50);
  };

  getStorage = async () => {
    try {
      let tmp = (await AsyncStorage.getItem("@darkMode")) === "true";
      if (tmp) {
        this.setState({ color: "white" });
      }
      tmp = Number(await AsyncStorage.getItem("@fontSize"));
      if (tmp === 1) {
        this.setState({ fontSize: 18 });
      } else if (tmp === 2) {
        this.setState({ fontSize: 22 });
      }
      tmp = Number(await AsyncStorage.getItem("@scrollSpeed"));
      if (tmp > 0) {
        this.setState({ speed: tmp });
      }
    } catch (e) {
      this.MessagesToast(e.toString());
    }
  };

  onLoad = async () => {
    try {
      let tmp = await AsyncStorage.getItem("@" + this.props.route.params.id);
      if (tmp != null) {
        this.setState({ data: JSON.parse(tmp), offline: true, loading: false });
      } else {
        this.setState({ offline: false });
        this.getChord();
      }
    } catch (e) {
      this.MessagesToast(e.toString());
      this.getChord();
    }
    this.getTerkait();
  };

  saveChord = async () => {
    try {
      let tmp = await AsyncStorage.getItem("@chordSaved");
      let isi = [
        {
          id: this.props.route.params.id,
          judul: this.props.route.params.judul,
          band: this.props.route.params.id_band,
          nama_band: this.props.route.params.band,
        },
      ];
      tmp = JSON.parse(tmp);
      if (tmp != null) {
        isi = [...tmp].concat(isi);
      }
      await AsyncStorage.setItem("@chordSaved", JSON.stringify(isi));

      await AsyncStorage.setItem(
        "@" + this.props.route.params.id,
        JSON.stringify(this.state.data)
      );
      this.setState({ offline: true });
      this.MessagesToast("Chord disimpan");
    } catch (e) {
      this.MessagesToast(e.toString());
    }
  };

  hapusChord = async () => {
    try {
      let tmp = await AsyncStorage.getItem("@chordSaved");
      tmp = JSON.parse(tmp);
      let nwTmp = [];
      tmp.forEach((e) => {
        if (e.id !== this.props.route.params.id) {
          nwTmp = [...nwTmp].concat([e]);
        }
      });
      await AsyncStorage.setItem("@chordSaved", JSON.stringify(nwTmp));
      await AsyncStorage.removeItem("@" + this.props.route.params.id);
      this.MessagesToast("berhasil");
      this.setState({ loading: true, offline: false });
      this.onLoad();
    } catch (e) {
      this.MessagesToast(e.toString());
    }
  };

  HapusButtonChord = () => {
    Alert.alert(
      "Hapus Chord",
      "Hapus " + this.props.route.params.judul + " ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => this.hapusChord() },
      ],
      { cancelable: true }
    );
  };

  scrollPage() {
    //start;
    if (!this.state.scroll) {
      this._interfal = setInterval(() => {
        if (this.state.currentHeight > this.state.scrollHeight / 2) {
          clearInterval(this._interfal);
          this.setState({ scroll: false });
        } else {
          this.scrollView.scrollTo(
            {
              x: 0,
              y: this.state.currentHeight + this.state.speed / 2,
              // animated: true,
            },
            8000
          );
        }
      });
    } else {
      //stop
      clearInterval(this._interfal);
    }
    this.setState({ scroll: !this.state.scroll });
  }

  stopScroll() {
    clearInterval(this._interfal);
    this.setState({ scroll: false });
  }

  saveLatest = async (value) => {
    await AsyncStorage.setItem("@terakhir", JSON.stringify(value));
  };

  getChord = () => {
    this.setState({ err: false });
    fetch(chordLagu(this.props.route.params.id), {
      method: "GET",
      headers: {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          data: decode(responseData.isi),
          loading: false,
        });
        this.saveLatest([
          {
            id: responseData.id,
            judul: responseData.judul,
            band: responseData.band,
            nama_band: responseData.nama_band,
          },
        ]);
      })
      .catch((e) => {
        this.setState({ err: true });
        this.MessagesToast("Kesalahan " + e);
      });
  };

  getTerkait = async () => {
    this.setState({ errTerkait: false });
    fetch(laguTerkait(this.props.route.params.id), {
      method: "GET",
      headers: {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataTerkait: responseData,
        });
      })
      .catch((e) => {
        this.setState({ errTerkait: true });
        this.MessagesToast("Kesalahan " + e);
      });
  };

  showInterstitial() {
    AdMobInterstitial.showAd().catch((error) =>
      this.MessagesToast(
        "Anda harus melihat iklan untuk menyimpan chord " + error.toString()
      )
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Layout level="1">
          <TopNavigation
            accessoryLeft={() => (
              <TopNavigationAction onPress={() => goBack()} icon={icon} />
            )}
            style={styles.topNavigation}
            alignment="center"
            title={() => (
              <Text numberOfLines={1} style={styles.headerText} category="h6">
                {this.props.route.params.judul}
              </Text>
            )}
            subtitle={() => (
              <Text
                style={styles.headerText}
                appearance="hint"
                numberOfLines={1}
              >
                {this.props.route.params.band}
              </Text>
            )}
          />
        </Layout>
        <Layout style={styles.tool} level="2">
          <ButtonGroup
            size="small"
            appearance={this.state.loading ? "filled" : "outline"}
            status={this.state.loading ? "basic" : "info"}
          >
            <Button
              onPress={() => this.setState({ data: capoUp(this.state.data) })}
              disabled={this.state.loading}
            >
              Capo +
            </Button>
            <Button
              onPress={() => this.scrollPage()}
              disabled={this.state.loading}
            >
              {this.state.scroll ? "Stop" : "Scroll"}
            </Button>
            <Button
              onPress={() =>
                this.state.offline
                  ? this.HapusButtonChord()
                  : this.showInterstitial()
              }
              status="danger"
              disabled={this.state.loading}
            >
              {this.state.offline ? "Hapus" : "Simpan"}
            </Button>
            <Button
              onPress={() => this.setState({ data: capoDown(this.state.data) })}
              disabled={this.state.loading}
            >
              Capo -
            </Button>
          </ButtonGroup>
        </Layout>
        <Layout level="3" style={styles.content}>
          {this.state.loading ? (
            <View style={{ flex: 1, alignItems: "center", paddingTop: 50 }}>
              {this.state.err ? (
                <Button
                  onPress={() => this.getChord()}
                  appearance="outline"
                  accessoryLeft={reload}
                >
                  Muat Ulang
                </Button>
              ) : (
                <Spinner size="giant" />
              )}
            </View>
          ) : (
            <View style={styles.webView}>
              <ScrollView
                onContentSizeChange={(w, h) =>
                  this.setState({ scrollHeight: h })
                }
                ref={(ref) => (this.scrollView = ref)}
                onScroll={(e) =>
                  this.setState({
                    currentHeight: e.nativeEvent.contentOffset.y,
                  })
                }
                onTouchStart={() => this.stopScroll()}
              >
                <HTMLView
                  stylesheet={{
                    body: { color: this.state.color },
                    html: { padding: 20, fontSize: this.state.fontSize },
                    span: { color: "red", fontWeight: "bold" },
                  }}
                  value={"<html><body>" + this.state.data + "</body></html>"}
                />
                <Divider />
                <Text style={styles.listDivider} appearance="hint">
                  Chord Lainya
                </Text>
                <Layout
                  style={{ flex: 1, alignItems: "center", paddingBottom: 30 }}
                  level="2"
                >
                  {this.state.dataTerkait.length > 0 ? (
                    this.state.dataTerkait.map((d, i) => {
                      return (
                        <ListItem
                          key={i}
                          onPress={() => {
                            navigate("chordView", {
                              id: d.id,
                              judul: d.judul,
                              band: d.nama_band,
                              id_band: d.band,
                            });
                            this.forceUpdateHandler();
                          }}
                          accessoryLeft={music}
                          accessoryRight={iconRight2}
                          title={d.judul}
                          description={d.nama_band}
                        />
                      );
                    })
                  ) : (
                    <View style={{ padding: 30 }}>
                      {this.state.errTerkait ? (
                        <Button
                          onPress={() => this.getTerkait()}
                          appearance="outline"
                          accessoryLeft={reload}
                          size="small"
                        >
                          Muat Ulang
                        </Button>
                      ) : (
                        <Spinner size="giant" status="primary" />
                      )}
                    </View>
                  )}
                </Layout>
              </ScrollView>
              <Layout
                style={
                  {
                    // paddingVertical: 10,
                  }
                }
                level="2"
              >
                <AdMobBanner
                  adSize="smartBanner"
                  adUnitID="ca-app-pub-1690523413615203/2186621936"
                />
              </Layout>
            </View>
          )}
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
  headerText: {
    paddingLeft: 60,
    paddingRight: 60,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tool: {
    flexDirection: "column",
    padding: 10,
    alignItems: "center",
  },
  webView: {
    flex: 1,
  },
  listDivider: {
    padding: 15,
    paddingBottom: 5,
  },
});
