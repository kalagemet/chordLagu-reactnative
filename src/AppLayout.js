import React from "react";
import { StyleSheet } from "react-native";
import {
  BottomNavigation,
  BottomNavigationTab,
  Divider,
  Icon,
  Layout,
  ViewPager,
} from "@ui-kitten/components";
import Home from "./Home/Home";
import Setting from "./Setting/Setting";
import Tuner from "./Tuner/Tuner";

const icon1 = (props) => <Icon {...props} name="home" />;
const icon3 = (props) => <Icon {...props} name="options" />;
const icon4 = (props) => <Icon {...props} name="settings-2-outline" />;

export default function AppLayout() {
  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <Layout level="2" style={styles.container}>
      <ViewPager
        shouldLoadComponent={(i) => i === selectedTab}
        selectedIndex={selectedTab}
        onSelect={(i) => {
          setSelectedTab(i);
        }}
        style={styles.contenLayout}
      >
        <Home />
        <Tuner />
        <Setting />
      </ViewPager>
      <Layout level="1" style={styles.bottomNavigation}>
        <Divider />
        <BottomNavigation
          appearance="noIndicator"
          selectedIndex={selectedTab}
          onSelect={(i) => {
            setSelectedTab(i);
          }}
          style={styles.bottomNavigation}
        >
          <BottomNavigationTab title="Home" icon={icon1} />
          <BottomNavigationTab title="Tuner" icon={icon3} />
          <BottomNavigationTab title="Setting" icon={icon4} />
        </BottomNavigation>
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  contenLayout: {
    flex: 10,
  },
  bottomNavigation: {
    flex: 1,
  },
});
