import {
  Divider,
  Icon,
  Layout,
  ListItem,
  Spinner,
  Text,
  TopNavigation,
  Button,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { goBack, navigate } from "../RootNavigation";
import { lagu } from "../var";
import { AdMobBanner } from "react-native-admob";
import Toast from "react-native-simple-toast";

const icon = (props) => (
  <Icon {...props} size="big" name="arrow-ios-back-outline" />
);
const iconRight = (props) => <Icon {...props} name="chevron-right-outline" />;
const music = (props) => <Icon {...props} name="music" />;
const iconMore = (props) => (
  <Icon {...props} name="arrow-circle-down-outline" />
);

export default class Lagu extends Component {
  state = {
    loading: true,
    loadMore: false,
    lagu: [],
    currentData: -1,
    totalData: 2,
  };

  componentDidMount() {
    this.getLagu();
  }

  MessagesToast = (msg) => {
    Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM, 25, 50);
  };

  getLagu = () => {
    this.setState({ loadMore: true });
    fetch(lagu(this.props.route.params.band, this.state.currentData), {
      method: "GET",
      headers: {
        apa: "79fa2fcaecf5c83c299cd96e2ba44710",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          currentData: responseData.currentPage,
          totalData: responseData.totalPages,
          lagu: this.state.lagu.concat(responseData.row),
          loading: false,
          loadMore: false,
        });
      })
      .catch((e) => {
        this.MessagesToast("Kesalahan " + e);
        this.setState({
          loading: false,
          loadMore: false,
        });
      });
  };

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
                {this.props.route.params.nama}
              </Text>
            )}
          />
        </Layout>
        <Divider />
        {this.state.loading ? (
          <Layout style={styles.spiner} level="2">
            <Spinner size="giant" status="primary" />
          </Layout>
        ) : (
          <Layout style={styles.content} level="2">
            <Layout
              style={{
                alignItems: "center",
                paddingVertical: 20,
              }}
              level="2"
            >
              <AdMobBanner
                adSize="smartBanner"
                adUnitID="ca-app-pub-1690523413615203/1648060728"
              />
            </Layout>
            <ScrollView>
              <Text style={styles.listDivider} appearance="hint">
                Daftar Lagu
              </Text>
              {this.state.lagu.map((d, i) => {
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
                    />
                    <Divider />
                  </View>
                );
              })}
              {this.state.currentData >= this.state.totalData - 1 ? (
                <Text
                  style={{ padding: 30, textAlign: "center" }}
                  appearance="hint"
                >
                  End of Page
                </Text>
              ) : (
                <Button
                  disabled={this.state.loadMore}
                  onPress={() => this.getLagu()}
                  accessoryLeft={iconMore}
                  appearance="outline"
                  status="info"
                  style={{ margin: 20 }}
                >
                  Lainya
                </Button>
              )}
            </ScrollView>
          </Layout>
        )}
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
  },
  spiner: {
    // flex: 1,
    height: "100%",
    alignItems: "center",
    paddingTop: 100,
  },
  listDivider: {
    padding: 15,
  },
});
