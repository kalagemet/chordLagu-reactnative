import React from "react";
import * as eva from "@eva-design/eva";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import Tentang from "./src/Tentang/Tentang";
import AppLayout from "./src/AppLayout";
import { navigationRef } from "./src/RootNavigation";
import { SafeAreaView, StatusBar } from "react-native";
import ChordView from "./src/Home/Chord";
import Band from "./src/Home/Band";
import Lagu from "./src/Home/Lagu";
import CariLagu from "./src/Home/CariLagu";
import CariBand from "./src/Home/CariBand";
import { Consumer, Context } from "./src/Context";

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <IconRegistry icons={EvaIconsPack} />
        <Context>
          <Consumer>
            {({ darkMode }) => (
              <ApplicationProvider
                {...eva}
                theme={darkMode ? eva.dark : eva.light}
              >
                <StatusBar
                  backgroundColor={darkMode ? "rgb(26,33,56)" : "white"}
                  barStyle={darkMode ? "light-content" : "dark-content"}
                />
                <NavigationContainer ref={navigationRef}>
                  <Stack.Navigator>
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="App"
                      component={AppLayout}
                    />
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="Tentang"
                      component={Tentang}
                    />
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="chordView"
                      component={ChordView}
                    />
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="band"
                      component={Band}
                    />
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="lagu"
                      component={Lagu}
                    />
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="cariBand"
                      component={CariBand}
                    />
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="cariLagu"
                      component={CariLagu}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </ApplicationProvider>
            )}
          </Consumer>
        </Context>
      </SafeAreaView>
    </>
  );
}
