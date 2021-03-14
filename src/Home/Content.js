import {
  Layout,
  Spinner,
  ListItem,
  Text,
  Divider,
  Card,
  Button,
  Icon,
} from "@ui-kitten/components";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { navigate } from "../RootNavigation";
import { populer, terbaru } from "../var";
import { AdMobBanner } from "react-native-admob";
import Toast from "react-native-simple-toast";

const music = (props) => <Icon {...props} name="music" />;
const reload = (props) => <Icon {...props} name="refresh" />;
const iconRight = (props) => <Icon {...props} name="arrowhead-right-outline" />;
const iconRight2 = (props) => <Icon {...props} name="chevron-right-outline" />;
const huruf = [
  "0/?",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const Alphabet = () => {
  return huruf.map((d, i) => {
    return (
      <View key={i}>
        <ListItem
          onPress={() => navigate("band", { number: i + 1, alpa: d })}
          accessoryRight={iconRight}
          title={"Direktori - " + d}
        />
        <Divider />
      </View>
    );
  });
};

const CardHits = (d, i) => {
  return (
    <Card
      onPress={() =>
        navigate("chordView", {
          id: d.id,
          judul: d.judul,
          band: d.nama_band,
        })
      }
      status="success"
      style={styles.card}
      key={i}
    >
      <Text appearance="hint">{d.nama_band}</Text>
      <Text category="h6">{d.judul}</Text>
    </Card>
  );
};

const CardTerbaru = (d, i) => {
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
        accessoryLeft={music}
        accessoryRight={iconRight2}
        title={d.judul}
        description={d.nama_band}
      />
      <Divider />
    </View>
  );
};

export default class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingTerbaru: 0,
      terbaru: [],
      pop: [],
      errTerbaru: false,
      errPop: false,
      ads: false,
    };
    this._loader = false;
  }

  componentDidMount() {
    this._loader = true;
    this.getTerbaru();
    this.getPopuler();
  }

  componentWillUnmount() {
    this._loader = false;
  }

  MessagesToast = (msg) => {
    Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM, 25, 50);
  };

  getTerbaru = async () => {
    this._loader = true;
    this.setState({ errTerbaru: false });
    fetch(terbaru, {
      method: "GET",
      headers: {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ terbaru: responseData });
      })
      .catch((e) => {
        this.setState({ errTerbaru: true });
        this.MessagesToast("Kesalahan " + e);
      });
  };

  getPopuler = async () => {
    this._loader = true;
    this.setState({ errPop: false });
    fetch(populer, {
      method: "GET",
      headers: {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ pop: responseData });
      })
      .catch((e) => {
        this.setState({ errPop: true });
        this.MessagesToast("Kesalahan " + e);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Layout style={styles.content} level="2">
          <Layout
            style={{
              paddingBottom: 10,
              alignItems: "center",
            }}
            level="2"
          >
            <AdMobBanner
              adSize="smartBanner"
              adUnitID="ca-app-pub-1690523413615203/2186621936"
            />
          </Layout>
          <Text style={styles.listDivider} appearance="hint">
            Paling Hits
          </Text>
          {this.state.pop.length > 0 ? (
            this.state.pop.map((d, i) => CardHits(d, i))
          ) : (
            <Layout style={styles.spiner} level="2">
              {this.state.errPop ? (
                <Button
                  onPress={() => this.getPopuler()}
                  appearance="outline"
                  accessoryLeft={reload}
                  size="small"
                >
                  Muat Ulang
                </Button>
              ) : (
                <Spinner size="giant" status="primary" />
              )}
            </Layout>
          )}
          <Layout
            style={{
              alignItems: "center",
              paddingVertical: 20,
            }}
            level="2"
          >
            <AdMobBanner
              adSize="mediumRectangle"
              adUnitID="ca-app-pub-1690523413615203/8408167938"
            />
          </Layout>
          <Text style={styles.listDivider} appearance="hint">
            Chord Terbaru
          </Text>
          {this.state.terbaru.length > 0 ? (
            this.state.terbaru.map((d, i) => CardTerbaru(d, i))
          ) : (
            <Layout style={styles.spiner} level="2">
              {this.state.errTerbaru ? (
                <Button
                  onPress={() => this.getTerbaru()}
                  appearance="outline"
                  accessoryLeft={reload}
                  size="small"
                >
                  Muat Ulang
                </Button>
              ) : (
                <Spinner size="giant" status="primary" />
              )}
            </Layout>
          )}
          <Layout
            style={{
              paddingVertical: 20,
              alignItems: "center",
            }}
            level="2"
          >
            <AdMobBanner
              adSize="largeBanner"
              adUnitID="ca-app-pub-1690523413615203/3882846984"
            />
          </Layout>
          <Text style={styles.listDivider} appearance="hint">
            Alphabet
          </Text>
          <Alphabet />
          <Text style={{ padding: 30, textAlign: "center" }} appearance="hint">
            End of Page
          </Text>
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
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  list: {
    flex: 1,
  },
  listDivider: {
    padding: 15,
  },
  card: {
    // padding: 10,
    marginBottom: 5,
    marginRight: 20,
    marginLeft: 20,
  },
});
