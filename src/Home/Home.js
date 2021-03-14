import {
  Button,
  ButtonGroup,
  Divider,
  Icon,
  Input,
  Layout,
  ListItem,
  Popover,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { Component } from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  Animated,
  PixelRatio,
} from "react-native";
import { canGoBack, goBack, navigate } from "../RootNavigation";
import Saved from "./Saved";
import Content from "./Content";
import Toast from "react-native-simple-toast";
import PTRView from "react-native-pull-to-refresh";

const icon = (props) => <Icon {...props} name="info-outline" />;
const iconRight = (props) => <Icon {...props} name="arrowhead-right-outline" />;
const iconSearch = (props) => <Icon {...props} name="search-outline" />;

const scrollY = new Animated.Value(0);
const startHeaderHeight = 200 - (4 - PixelRatio.get()) * 10;
const endHeaderHeight = 70;
const diffClamp = Animated.diffClamp(scrollY, 0, startHeaderHeight);

const animatedHeaderHeight = diffClamp.interpolate({
  inputRange: [0, startHeaderHeight],
  outputRange: [startHeaderHeight, endHeaderHeight],
  extrapolate: "clamp",
});

const animatedOpacity = animatedHeaderHeight.interpolate({
  inputRange: [endHeaderHeight, startHeaderHeight],
  outputRange: [0, 1],
  extrapolate: "clamp",
});

const animatedTop = animatedHeaderHeight.interpolate({
  inputRange: [endHeaderHeight, startHeaderHeight],
  outputRange: [-50, 0],
  extrapolate: "clamp",
});

const headerTop = () => {
  return (
    <Text style={styles.headerText} category="h4">
      Chord Lagu
    </Text>
  );
};

const tentang = () => {
  return (
    <TopNavigationAction onPress={() => navigate("Tentang")} icon={icon} />
  );
};

const searchAnchor = () => {
  return <Divider style={styles.searchAnchor} />;
};

const textCariLagu = (key) => {
  return (
    <Text category="h6" numberOfLines={1}>
      {'"' + key + '"'}
    </Text>
  );
};

const textCariBand = (key) => {
  return (
    <Text category="h6" numberOfLines={1}>
      {'"' + key + '"'}
    </Text>
  );
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topBar: 0,
      search: false,
      key: "",
      backExit: 0,
    };
    this._refresh = this._refresh.bind(this);
  }

  componentDidMount() {
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

  _refresh = () => {
    // you must return Promise everytime
    return new Promise((resolve) => {
      setTimeout(() => {
        // some refresh process should come here
        let tmp = this.state.topBar;
        this.setState({ topBar: tmp === 0 ? 1 : 0 }, () => {
          this.setState({ topBar: tmp });
        });
        resolve();
      }, 500);
    });
  };

  _contentView = () => {
    return this.state.topBar === 0 ? <Content /> : <Saved />;
  };

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

  searchButton = () => {
    return (
      <Button
        onPress={() => this.setState({ key: "" })}
        status="danger"
        // appearance="outline"
        size="tiny"
        accessoryLeft={iconSearch}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={{ height: animatedHeaderHeight }}>
          <TopNavigation
            style={styles.topNavigation}
            alignment="start"
            title={headerTop}
            accessoryRight={tentang}
          />
          <Layout level="1">
            <Animated.View
              style={
                (styles.subHeader,
                {
                  opacity: animatedOpacity,
                  top: animatedTop,
                })
              }
            >
              <Input
                value={this.state.key}
                placeholder="cari chord..."
                style={styles.cariInput}
                accessoryRight={
                  this.state.search ? this.searchButton : iconSearch
                }
                onFocus={() => this.setState({ search: true })}
                onChangeText={(s) => this.setState({ key: s })}
              />
              <Popover
                anchor={searchAnchor}
                backdropStyle={{ top: 120 }}
                visible={this.state.key != "" ? this.state.search : false}
                onBackdropPress={() =>
                  this.setState({ search: !this.state.search })
                }
                fullWidth
              >
                <Layout style={styles.cariPop} level="1">
                  <ListItem
                    accessoryRight={iconRight}
                    accessoryLeft={iconSearch}
                    title={textCariLagu(this.state.key)}
                    description="Cari untuk Lagu"
                    onPress={() => {
                      this.setState({ search: false });
                      navigate("cariLagu", { string: this.state.key });
                    }}
                  />
                  <Divider />
                  <ListItem
                    accessoryRight={iconRight}
                    accessoryLeft={iconSearch}
                    title={textCariBand(this.state.key)}
                    description="Cari untuk Band"
                    onPress={() => {
                      this.setState({ search: false });
                      navigate("cariBand", { string: this.state.key });
                    }}
                  />
                </Layout>
              </Popover>
              <ButtonGroup size="small" style={styles.topBar}>
                <Button
                  disabled={this.state.topBar === 0 ? true : false}
                  onPress={() => this.setState({ topBar: 0 })}
                >
                  {" "}
                  Online{" "}
                </Button>
                <Button
                  disabled={this.state.topBar === 0 ? false : true}
                  onPress={() => this.setState({ topBar: 1 })}
                >
                  Disimpan
                </Button>
              </ButtonGroup>
            </Animated.View>
          </Layout>
        </Animated.View>
        <Divider />
        <PTRView
          onRefresh={this._refresh}
          // bounces={true}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
          contentContainerStyle={styles.content}
        >
          {this._contentView()}
        </PTRView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  cariInput: {
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },
  cariPop: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  topBar: {
    justifyContent: "center",
    marginBottom: 10,
  },
  topNavigation: {
    // flex: 1,
    position: "relative",
    zIndex: 5,
    // elevation: 5,
    padding: 0,
    paddingTop: 20,
    paddingLeft: 20,
  },
  headerText: {
    fontWeight: "bold",
  },
  subHeader: {
    position: "absolute",
    zIndex: 4,
    elevation: 4,
  },
  content: {
    flexGrow: 1,
    // marginTop: -100,
    // paddingTop: 100,
  },
  searchAnchor: {
    // top: 10,
    position: "relative",
    opacity: 0,
  },
});
