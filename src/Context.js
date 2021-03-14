import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Appearance } from "react-native";

let ContextType;
const { Provider, Consumer } = (ContextType = React.createContext());

class Context extends React.Component {
  state = {
    darkMode: false,
  };

  componentDidMount() {
    this.sync();
  }

  sync = async () => {
    let tmp = (await AsyncStorage.getItem("@darkModeAuto")) === "true";
    if (tmp) {
      if (Appearance.getColorScheme() === "dark") {
        this.setState({ darkMode: true });
      } else {
        this.setState({ darkMode: false });
      }
    } else {
      tmp = (await AsyncStorage.getItem("@darkMode")) === "true";
      this.setState({ darkMode: tmp });
    }
  };

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          sync: this.sync,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { Context, Consumer, ContextType };
