import { StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import SongList from "../../components/SongList";
import * as STORAGE from "../../Storage";
import * as API from "../../api/SongDbApi";
import { useTheme } from "@react-navigation/native";

export default function Favourites({ navigation }) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [flatListItems, setFlatListItems] = useState(null);
  const [email, setEmail] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      getLikesList();
    });
    return unsubscribe;
  }, [navigation]);

  const getLikesList = () => {
    setLoading(true);
    STORAGE.getUserInfo((data) => {
      if (data) {
        API.syncLocalAndApiLikes(
          data.email,
          () => {
            setEmail(data.email);
            API.getMyLikes(
              data.email,
              (data) => {
                data.totalItems == 0 && setLoading(false);
                setCurrentPage(data.currentPage);
                setFlatListItems(data.row);
                setRefreshing(false);
              },
              () => {
                console.log("dari local");
                STORAGE.getSavedList((data) => {
                  !data && setLoading(false);
                  setFlatListItems(data);
                });
                setRefreshing(false);
              }
            );
          },
          () => {
            console.log("dari local");
            STORAGE.getSavedList((data) => {
              !data && setLoading(false);
              setFlatListItems(data);
            });
            setRefreshing(false);
          }
        );
      } else {
        console.log("dari local");
        STORAGE.getSavedList((data) => {
          !data && setLoading(false);
          setFlatListItems(data);
        });
        setRefreshing(false);
        setLoading(false);
      }
    });
  };

  const toViewSong = (id) => {
    navigation.navigate("ViewSong", {
      id: id,
      user: email,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getLikesList();
  };

  const handleLoadMore = async () => {
    API.loadMoreMyLikes(
      email,
      currentPage,
      (data) => {
        let songs = [...flatListItems];
        data.row.forEach((r) => {
          songs.push(r);
        });
        setFlatListItems(songs);
        setCurrentPage(data.currentPage);
        console.log(
          "current : " + data.currentPage + ", total : " + data.totalPages
        );
        data.currentPage >= data.totalPages && setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  };

  const emptyList = () => {
    return (
      !loading && (
        <View style={{ padding: "5%", alignItems: "center" }}>
          <Text style={{ color: colors.text }}>Tidak ada chord favorit</Text>
        </View>
      )
    );
  };

  return (
    <View style={styles.Container}>
      <SongList
        songs={flatListItems}
        onPress={(id) => toViewSong(id)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        loading={loading}
        handleLoadMore={handleLoadMore}
        paginate={true}
        renderEmptyComponent={emptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  LoginContainer: {
    height: "70%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  TextInfo: {
    color: "grey",
    marginTop: "5%",
    marginBottom: "5%",
  },
});
