import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Text,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { WebView } from "react-native-webview";

export default function StreamModal({ id, closeModalStream }) {
  const [webviewLoaded, setWebviewLoaded] = useState(false);
  const webViewRef = useRef();

  const onLoadEnd = () => {
    setWebviewLoaded(true);
  };

  const uri =
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" +
    id +
    "&show_artwork=false&color=000&show_comments=false&hide_related=true";
  return (
    <View style={styles.activityIndicatorWrapper}>
      {webviewLoaded ? null : (
        <View style={{ width: "90%", alignItems: "center" }}>
          <ActivityIndicator color="#000" animating={true} size="large" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f5" }}
        source={{ uri: uri }}
        onNavigationStateChange={(event) => {
          if (event.url !== uri) {
            webViewRef.current.stopLoading();
            Linking.openURL(event.url);
          }
        }}
        userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        startInLoadingState={false}
        onLoadEnd={onLoadEnd}
      />
      <TouchableOpacity style={styles.close} onPress={closeModalStream}>
        <Ionicons color="black" size={35} name="close" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  close: {
    height: "100%",
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
});
