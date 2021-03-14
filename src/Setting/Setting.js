import {
  Layout,
  TopNavigation,
  Text,
  Divider,
  ListItem,
  TopNavigationAction,
  Icon,
  Button,
  Modal,
  Toggle,
  Card,
  Input,
  Radio,
  RadioGroup,
} from "@ui-kitten/components";
import React, { Component } from "react";
import { canGoBack, goBack, navigate } from "../RootNavigation";
import { BackHandler, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ContextType } from "../Context";
import { AdMobBanner } from "react-native-admob";

const icon = (props) => <Icon {...props} name="info-outline" />;
const iconRight = (props) => <Icon {...props} name="chevron-right-outline" />;

export default class Setting extends Component {
  static contextType = ContextType;
  state = {
    visible: false,
    speed: 5,
    tmpSpeed: 5,
    limit: false,
    limitUp: false,
    setTextVisible: false,
    selectedText: 0,
    tmpSelectedText: 0,
    darkMode: false,
    darkModeAuto: false,
    backExit: 0,
  };

  MessagesToast(msg) {
    Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM, 25, 50);
  }

  componentDidMount() {
    this.getStorage();
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  }

  handleBackButton() {
    this.setState({
      speed: this.state.tmpSpeed,
      visible: false,
      setTextVisible: false,
      selectedText: this.state.tmpSelectedText,
    });
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

  getStorage = async () => {
    try {
      let tmp = Number(await AsyncStorage.getItem("@scrollSpeed"));
      if (tmp != null) {
        this.setState({ speed: tmp, tmpSpeed: tmp });
      }
      tmp = Number(await AsyncStorage.getItem("@fontSize"));
      if (tmp != null) {
        this.setState({ selectedText: tmp, tmpSelectedText: tmp });
      }
      tmp = (await AsyncStorage.getItem("@darkModeAuto")) === "true";
      if (tmp) {
        this.setState({ darkModeAuto: tmp });
      }
      tmp = (await AsyncStorage.getItem("@darkMode")) === "true";
      if (tmp) {
        this.setState({ darkMode: tmp });
      }
      tmp = (await AsyncStorage.getItem("@fontSize")) === "true";
      if (tmp) {
        this.setState({ darkMode: tmp });
      }
    } catch (e) {
      this.MessagesToast(e.toString());
    }
  };

  saveScroll = async () => {
    try {
      await AsyncStorage.setItem("@scrollSpeed", this.state.speed.toString());
      this.setState({ tmpSpeed: this.state.speed });
      this.MessagesToast("Berhasil");
    } catch (e) {
      this.MessagesToast(e.toString());
    }
    this.setState({ visible: false });
  };

  scrollDown() {
    if (this.state.speed > 1) {
      this.setState({
        limitUp: false,
        speed: this.state.speed - 1,
      });
    } else {
      this.setState({ limit: true });
    }
  }

  scrollUp() {
    if (this.state.speed < 10) {
      this.setState({
        limit: false,
        speed: this.state.speed + 1,
      });
    } else {
      this.setState({ limitUp: true });
    }
  }

  saveFont = async () => {
    try {
      await AsyncStorage.setItem(
        "@fontSize",
        this.state.selectedText.toString()
      );
      this.setState({ tmpSelectedText: this.state.selectedText });
      this.MessagesToast("Berhasil");
    } catch (e) {
      this.MessagesToast(e.toString());
    }
    this.setState({ setTextVisible: false });
  };

  setDarkMode = async () => {
    try {
      await AsyncStorage.setItem(
        "@darkMode",
        this.state.darkMode ? "false" : "true"
      );
      this.setState({ darkMode: !this.state.darkMode });
      this.MessagesToast("Berhasil");
    } catch (e) {
      this.MessagesToast(e.toString());
    }
    this.context.sync();
  };

  setDarkModeAuto = async () => {
    try {
      await AsyncStorage.setItem(
        "@darkModeAuto",
        this.state.darkModeAuto ? "false" : "true"
      );
      this.setState({ darkModeAuto: !this.state.darkModeAuto });
      this.MessagesToast("Berhasil");
    } catch (e) {
      this.MessagesToast(e.toString());
    }
    this.context.sync();
  };

  render() {
    return (
      <Layout level="2" style={styles.container}>
        <Modal
          visible={this.state.visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() =>
            this.setState({ speed: this.state.tmpSpeed, visible: false })
          }
        >
          <Card
            header={() => (
              <Text style={styles.modalHeader} category="h6">
                Atur Kecepatan
              </Text>
            )}
            footer={() => (
              <Button onPress={() => this.saveScroll()}>Oke</Button>
            )}
            disabled={true}
            style={{ minWidth: "70%" }}
          >
            <Input
              placeholder="null"
              value={JSON.stringify(this.state.speed)}
              textAlign="center"
              disabled
              accessoryLeft={() => (
                <Button
                  disabled={this.state.limit}
                  onPress={() => this.scrollDown()}
                  appearance="outline"
                  status="danger"
                >
                  -
                </Button>
              )}
              accessoryRight={() => (
                <Button
                  disabled={this.state.limitUp}
                  onPress={() => this.scrollUp()}
                  appearance="outline"
                  status="success"
                >
                  +
                </Button>
              )}
            />
          </Card>
        </Modal>

        <Modal
          visible={this.state.setTextVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() =>
            this.setState({
              setTextVisible: false,
              selectedText: this.state.tmpSelectedText,
            })
          }
        >
          <Card
            header={() => (
              <Text style={styles.modalHeader} category="h6">
                Ukuran Teks
              </Text>
            )}
            footer={() => <Button onPress={() => this.saveFont()}>Oke</Button>}
            style={{ minWidth: "70%" }}
            disabled={true}
          >
            <RadioGroup
              selectedIndex={this.state.selectedText}
              onChange={(i) => this.setState({ selectedText: i })}
            >
              <Radio>Kecil</Radio>
              <Radio>Normal</Radio>
              <Radio>Besar</Radio>
            </RadioGroup>
          </Card>
        </Modal>

        <Layout level="1">
          <TopNavigation
            style={styles.topNavigation}
            alignment="center"
            title={() => (
              <Text style={styles.headerText} category="h5">
                Pengaturan
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
        <Divider />
        <Layout style={styles.content} level="2">
          <ScrollView>
            <Text style={styles.label} appearance="hint" category="s1">
              Tampilan
            </Text>
            <ListItem
              title="Mode Gelap Otomatis"
              description="Atur mode gelap sesuai sistem"
              onPress={() => this.setDarkModeAuto()}
              accessoryRight={() => (
                <Toggle
                  onChange={() => this.setDarkModeAuto()}
                  checked={this.state.darkModeAuto}
                />
              )}
            />
            <Divider />
            <ListItem
              disabled={this.state.darkModeAuto}
              title="Mode Gelap"
              description="Atur mode gelap aplikasi"
              onPress={() => this.setDarkMode()}
              accessoryRight={() => (
                <Toggle
                  disabled={this.state.darkModeAuto}
                  onChange={() => this.setDarkMode()}
                  checked={this.state.darkMode}
                />
              )}
            />
            <Divider />
            <Layout
              style={{
                alignItems: "center",
                paddingVertical: 20,
              }}
              level="2"
            >
              <AdMobBanner
                adSize="smartBanner"
                adUnitID="ca-app-pub-1690523413615203/9681968577"
              />
            </Layout>
            <Text style={styles.label} appearance="hint" category="s1">
              Layar
            </Text>
            <ListItem
              title="Kecepatan Scroll"
              description="Atur kecepatan scroll"
              onPress={() => this.setState({ visible: true })}
              accessoryRight={iconRight}
            />
            <Divider />
            <ListItem
              title="Ukuran Teks"
              description="Sesuaikan ukuran teks"
              accessoryRight={iconRight}
              onPress={() => this.setState({ setTextVisible: true })}
            />
            <Divider />
            <Text style={styles.label} appearance="hint" category="s1">
              Iklan
            </Text>
            <Layout
              style={{
                alignItems: "center",
              }}
              level="2"
            >
              <AdMobBanner
                adSize="mediumRectangle"
                adUnitID="ca-app-pub-1690523413615203/2054652194"
              />
              <Divider />
            </Layout>
          </ScrollView>
        </Layout>
      </Layout>
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
  content: {
    flex: 1,
  },
  list: {
    height: 23,
  },
  label: {
    padding: 10,
    paddingLeft: 15,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalHeader: {
    padding: 10,
    textAlign: "center",
  },
});
