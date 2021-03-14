import {
  Layout,
  TopNavigation,
  Text,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import React, { Component } from "react";
import {
  BackHandler,
  PermissionsAndroid,
  StyleSheet,
  View,
} from "react-native";
import { canGoBack, goBack, navigate } from "../RootNavigation";
import TunerTone from "./_tuner";
import Note from "./_note";
import Meter from "./_meter";
import Toast from "react-native-simple-toast";
import { AdMobBanner } from "react-native-admob";
import IdleTimerManager from "react-native-idle-timer";

const icon = (props) => <Icon {...props} name="info-outline" />;

export default class Tuner extends Component {
  _isMounted = false;

  state = {
    note: {
      name: "A",
      octave: 4,
      frequency: 440,
    },
    backExit: 0,
  };

  _update(note) {
    this.setState({ note });
  }

  componentDidMount() {
    this._isMounted = true;
    this.mountTuner();
    IdleTimerManager.setIdleTimerDisabled(true);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  }

  async mountTuner() {
    this._isMounted = true;
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    const tuner = new TunerTone();
    tuner.start();
    tuner.onNoteDetected = (note) => {
      if (this._lastNoteName === note.name) {
        this._update(note);
      } else {
        this._lastNoteName = note.name;
      }
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
    IdleTimerManager.setIdleTimerDisabled(false);
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  }

  handleBackButton() {
    this.state.backExit == 1 ? BackHandler.exitApp() : this.toastExit();
    return true;
  }

  toastExit() {
    if (canGoBack()) {
      goBack();
    } else {
      this.setState({ backExit: 1 }, () => {
        Toast.showWithGravity(
          "Sekali lagi untuk keluar",
          Toast.LONG,
          Toast.BOTTOM,
          1,
          50
        );
        setTimeout(() => this.setState({ backExit: 0 }), 2000);
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Layout level="1">
          <TopNavigation
            style={styles.topNavigation}
            alignment="center"
            title={() => (
              <Text style={styles.headerText} category="h6">
                Gitar Tuner
              </Text>
            )}
            accessoryRight={() => (
              <TopNavigationAction
                onPress={() => navigate("Tentang")}
                icon={icon}
              />
            )}
          />
        </Layout>
        <Layout
          style={{
            paddingVertical: 10,
            zIndex: 30,
          }}
          level="2"
        >
          <AdMobBanner
            adSize="smartBanner"
            adUnitID="ca-app-pub-1690523413615203/8560458595"
          />
        </Layout>
        <Layout style={styles.content} level="2">
          <Meter cents={this.state.note.cents} />
          <Note {...this.state.note} />
          <Text category="h5" style={styles.frequency}>
            {"\n"}
            {this.state.note.frequency.toFixed(1)} Hz
          </Text>
          <Layout
            style={{
              paddingVertical: 20,
              alignItems: "center",
            }}
            level="2"
          >
            <AdMobBanner
              adSize="largeBanner"
              adUnitID="ca-app-pub-1690523413615203/5934295255"
            />
          </Layout>
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
    // paddingLeft: 15,
  },
  headerText: {},
  content: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  frequency: {
    // fontSize: 28,
    // color: "#37474f",
  },
  on: {
    marginTop: 40,
  },
});
