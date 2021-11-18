import React, { useState, useRef, useMemo } from "react";
import {
  StyleSheet,
  Alert,
  ToastAndroid,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { getStreamsBySearch } from "../api/StreamsApi";
import StreamList from "../components/StreamList";
import BottomSheet from "@gorhom/bottom-sheet";
import StreamModal from "../components/StreamModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import * as API from "../api/SongDbApi";
import * as STORAGE from "../Storage";
import { useTheme } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { decode } from "../utils/decode";
import chords from "../assets/chords/guitar.json";
import ChordModal from "../components/ChordModal";
import { capoDown, capoUp } from "../utils/capo";
import Loader from "../components/Loader";
import KeepAwake from "react-native-keep-awake";
import Swiper from "react-native-swiper";
import SongList from "../components/SongList";

export default function ViewSong({ navigation, route }) {
  const { colors } = useTheme();
  const [transpose, setTranspose] = useState(0);
  const [scrollActive, setScrollActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(0.5);
  const [jsRun, setJsRun] = useState(``);
  const [favourited, setFavourited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamsList, setStreamsList] = useState([]);
  const [showStream, setShowStream] = useState(false);
  const [streamId, setStreamId] = useState("");
  const [content, setContent] = useState("");
  const [chordName, setChordName] = useState("");
  const [showChord, setShowChord] = useState(false);
  const [selectedChord, setSelectedChord] = useState("");
  const [fontSize, setFontSize] = useState(100);
  const [data, setData] = useState([]);
  const [chordTerkait, setChordTekait] = useState([]);
  const [id, setId] = useState(route.params.id);
  const user = route.params.user;
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["10%", "40%"], []);
  const webViewRef = useRef();

  React.useEffect(() => {
    console.log("id: " + id);
    setLoading(true);
    getChordContent(id);
    API.getTerkait(
      id,
      (data) => {
        setChordTekait(data);
      },
      () => {
        console.log("gagal mendapatkan chord terkait");
      }
    );
  }, [navigation, id]);

  React.useEffect(() => {
    !loading && webViewRef.current.injectJavaScript(jsRun);
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showStream) {
          closeStream();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [showStream, closeStream])
  );

  const getChordContent = (id) => {
    STORAGE.getSavedSong(id, (item) => {
      if (item && item.id == id) {
        setFavourited(true);
      }
      API.getSongContent(
        id,
        (data) => {
          let chordData = {
            judul: data.judul,
            nama_band: data.nama_band,
            created_by: data.created_by,
          };
          setData(chordData);
          setContent(decode(data.isi));
          getStreamsBySearch(
            data.judul + " " + data.nama_band,
            (streamsList) => {
              setStreamsList(streamsList);
            }
          );
          setLoading(false);
        },
        () => {
          if (item && item.id == id) {
            let chordData = {
              judul: item.judul,
              nama_band: item.nama_band,
              created_by: item.created_by,
            };
            setData(chordData);
            setFavourited(true);
            setContent(decode(item.isi));
            getStreamsBySearch(
              item.judul + " " + item.nama_band,
              (streamsList) => {
                setStreamsList(streamsList);
              }
            );
            setLoading(false);
          } else {
            setLoading(false);
            navigation.pop();
          }
        }
      );
    });
  };

  const transposeUp = () => {
    setContent(capoUp(content));
    setTranspose(transpose + 1);
  };

  const transposeDown = () => {
    setContent(capoDown(content));
    setTranspose(transpose - 1);
  };

  const handelSliderChange = (value) => {
    setSliderValue(value);
    setScrollActive(true);
    if (value <= 0) {
      setJsRun(`
      if(window.intervalId) {
        clearInterval(window.intervalId);
      }
      true;
      `);
    } else {
      setJsRun(`
      function pageScroll(){
        window.scrollBy(0,1);
      }
      if(window.intervalId) {
        clearInterval(window.intervalId);
      }
      window.intervalId = setInterval(pageScroll, ${(1 - value) * 300 + 10});
      true;
      `);
    }
  };

  const start = () => {
    setScrollActive(true);
    handelSliderChange(sliderValue);
  };

  const stop = () => {
    setScrollActive(false);
    setJsRun(`
    if(window.intervalId) {
      clearInterval(window.intervalId);
    }
    true;
    `);
  };

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  const onDeleteSong = () => {
    Alert.alert(
      "Hapus",
      "Hapus Lagu ?",
      [
        {
          text: "Batal",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Ya", onPress: () => _delete() },
      ],
      { cancelable: false }
    );
  };

  const _delete = () => {
    setLoading(true);
    API.deleteChord(
      id,
      () => {
        STORAGE.deleteSaved(id, () => {
          setLoading(false);
          showToast("Berhasil Dihapus");
          navigation.pop();
        });
      },
      () => {
        setLoading(false);
        showToast("Gagal Dihapus");
        navigation.pop();
      }
    );
  };

  const onPressStream = (id) => {
    setStreamId(id);
    setShowStream(true);
  };

  const closeStream = () => {
    setShowStream(false);
  };

  const onClickLike = () => {
    const props = {
      id_chord: id,
      id_user: user,
    };
    setLoading(true);
    if (user) {
      if (favourited) {
        API.unLike(
          props,
          () => {
            STORAGE.deleteSaved(id, () => {
              setFavourited(false);
              setLoading(false);
              showToast("Berhasil Dihapus dari Favorit");
            });
          },
          () => {
            setLoading(false);
            showToast("Gagal Dihapus dari Favorit, periksa koneksi internet");
          }
        );
      } else {
        API.like(
          props,
          () => {
            API.getSongContent(id, (data) => {
              STORAGE.saveSong(data, () => {
                setFavourited(true);
                setLoading(false);
                showToast("Berhasil Disimpan di Favorit");
              });
            });
          },
          () => {
            setLoading(false);
            showToast("Gagal Disimpan di Favorit");
          }
        );
      }
    } else {
      if (favourited) {
        STORAGE.deleteSaved(id, () => {
          setFavourited(false);
          setLoading(false);
          showToast("Berhasil Dihapus dari Favorit");
        });
      } else {
        API.getSongContent(id, (data) => {
          STORAGE.saveSong(data, () => {
            setFavourited(true);
            setLoading(false);
            showToast("Berhasil Disimpan di Favorit");
          });
        });
      }
    }
  };

  const handleMessage = (selectedChord) => {
    if (chords[selectedChord.toString()]) {
      let chord = chords[selectedChord.toString()][0].positions;
      setChordName(selectedChord.toString());
      setSelectedChord(chord);
      setShowChord(true);
    }
  };

  const drawerHandler = () => {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          height: 30,
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: "20%",
            width: "20%",
            backgroundColor: colors.text,
            borderRadius: 5,
            alignSelf: "center",
          }}
        ></View>
      </View>
    );
  };
  
  const emptyList = () => {
    return (
      !loading && (
        <View style={{ padding: "5%", alignItems: "center" }}>
          <Text style={{ color: colors.text }}>Tidak ada chord terkait</Text>
        </View>
      )
    );
  };

  const renderDrawer = () => {
    return (
      <View
        style={{
          ...styles.bottomSheetContainer,
          backgroundColor: colors.background,
        }}
      >
        <View style={styles.scroll}>
          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "center" }}
            onPress={scrollActive ? stop : start}
          >
            <Text
              style={{
                fontSize: 20,
                color: colors.primary,
                marginRight: "3%",
              }}
            >
              Scroll
            </Text>
            {scrollActive ? (
              <Ionicons color={colors.primary} size={25} name="stop" />
            ) : (
              <Ionicons color={colors.primary} size={25} name="caret-down" />
            )}
          </TouchableOpacity>
          <Slider
            thumbTintColor={colors.notification}
            minimumTrackTintColor={colors.notification}
            style={{ flex: 1 }}
            value={sliderValue}
            onValueChange={(sliderValue) => handelSliderChange(sliderValue)}
            minimumValue={0}
            maximumValue={1}
          />
          <Text style={{ color: colors.primary }}>
            {sliderValue.toFixed(2)} x
          </Text>
        </View>
        <Swiper loop={false}>
          <View style={{ justifyContent: "space-between" }}>
            <View style={styles.tool}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Feather
                  color={colors.text}
                  size={35}
                  name="zoom-out"
                  onPress={() => {
                    fontSize > 10 && setFontSize(fontSize - 10);
                  }}
                />
                <Feather
                  color={colors.text}
                  size={35}
                  name="zoom-in"
                  onPress={() => setFontSize(fontSize + 10)}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingHorizontal: "5%",
                }}
              >
                <Ionicons
                  color={colors.text}
                  size={35}
                  name="remove"
                  onPress={transposeDown}
                />
                <Text
                  style={{
                    fontSize: 11,
                    alignSelf: "center",
                    marginHorizontal: "3%",
                    color: colors.text,
                  }}
                >
                  Nada: {transpose > 0 ? "+" + transpose : transpose}
                </Text>
                <Ionicons
                  color={colors.text}
                  size={35}
                  name="add"
                  onPress={transposeUp}
                />
              </View>
              {user == data.created_by || user == "afm5997@gmail.com" ? (
                <View
                  style={{
                    flexDirection: "row",
                    flex: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <Ionicons
                    name="heart"
                    style={{
                      fontSize: 35,
                      color: favourited ? "#F05454" : "#ccc",
                    }}
                    onPress={onClickLike}
                  />
                  <Ionicons
                    name="create"
                    style={{
                      fontSize: 35,
                      color: colors.primary,
                      marginHorizontal: "3%",
                    }}
                    onPress={() =>
                      navigation.navigate("EditSong", { path: id })
                    }
                  />
                  <Ionicons
                    name="trash"
                    style={{
                      fontSize: 35,
                      color: colors.primary,
                      justifyContent: "flex-end",
                    }}
                    onPress={onDeleteSong}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    flex: 2,
                  }}
                >
                  <Ionicons
                    name="heart"
                    style={{
                      fontSize: 35,
                      color: favourited ? "#F05454" : "#ccc",
                    }}
                    onPress={onClickLike}
                  />
                </View>
              )}
            </View>
            <View style={{ height: "70%" }}>
              {showStream ? (
                <StreamModal
                  showStream={showStream}
                  closeModalStream={closeStream}
                  id={streamId}
                />
              ) : (
                <StreamList streams={streamsList} onPress={onPressStream} />
              )}
            </View>
          </View>
          <View>
            <Text
              style={{
                marginVertical: "2%",
                color: colors.text,
                alignSelf: "center",
                height: "10%"
              }}
            >
              Chord Terkait
            </Text>
            <View style={{height:'80%'}}>
              <SongList
                songs={chordTerkait}
                onPress={(id) => setId(id)}
                renderEmptyComponent={emptyList}
              />
            </View>
          </View>
        </Swiper>
      </View>
    );
  };

  return loading ? (
    <Loader loading={true} />
  ) : (
    <View style={{ flex: 1 }}>
      <ChordModal
        show={showChord}
        name={chordName}
        selectedChord={selectedChord}
        closeModal={() => setShowChord(false)}
      />
      <View style={{ height: "91%" }}>
        <WebView
          ref={webViewRef}
          source={{
            html: `<html>
              <head>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                <h2>${data.judul}</h2>
                <h3>${data.nama_band}</h3>
              </head>
              <body>
                ${content}
              </body>
              <style> 
                body {
                  color:${colors.text};
                  font-size: ${fontSize}%;
                  font-family: monospace;
                }
                .chord {
                  color:${colors.notification};
                }
              </style>
            </html>`,
          }}
          injectedJavaScript={onClickChordPostMessage}
          onMessage={(event) => handleMessage(event.nativeEvent.data)}
          javaScriptEnabled={true}
          style={{ margin: 0, padding: 0, backgroundColor: colors.background }}
          scalesPageToFit={false}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enableContentPanningGesture={false}
        children={renderDrawer}
        handleComponent={drawerHandler}
        style={{
          elevation: 50,
          borderColor: colors.text,
          borderWidth: 2,
          borderTopStartRadius: 17,
          borderTopEndRadius: 17,
        }}
      />
      <KeepAwake />
    </View>
  );
}
const onClickChordPostMessage = `
(
  function() {
    function onClickChord (chord) {
      return function () {
        window.ReactNativeWebView.postMessage(chord)
      }
    }
    var anchors = document.getElementsByClassName('chord');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        var chord = anchor.innerText || anchor.textContent;
        anchor.onclick = onClickChord(chord)
    }
  }
)();

true;
`;
const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  scroll: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "5%",
    marginBottom: "2%",
  },
  tool: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "5%",
    marginTop: "5%",
  },
  item: {
    flexDirection: "row",
    paddingHorizontal: "5%",
    paddingVertical: "3%",
  },
});
