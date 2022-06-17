import { View, Text } from "react-native";
import React, { useState } from "react";
import Loader from "../../../components/Loader";
import SongList from "../../../components/SongList";
import { getSongsByArtist, loadMoreByArtist } from "../../../api/SongDbApi";
import { useTheme } from "@react-navigation/native";

export default function SongsByArtistList({ navigation, route }) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [bandSongs, setBandSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const artistId = route.params.id;
  const email = route.params.user;
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    console.log(artistId);
    setLoading(true);
    getSongsByArtist(
      artistId,
      currentPage,
      (data) => {
        setBandSongs(data.row);
        setCurrentPage(data.currentPage);
      },
      () => {
        setLoading(false);
      }
    );
  }, [navigation]);

  const toViewSong = (id) => {
    navigation.navigate("ViewSong", {
      id: id,
      user: email,
    });
  };

  const handleLoadMore = async () => {
    loadMoreByArtist(
      artistId,
      currentPage,
      (data) => {
        let songs = [...bandSongs];
        data.row.forEach((r) => {
          songs.push(r);
        });
        setBandSongs(songs);
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

  const onRefresh = () => {
    setRefreshing(true);
    getSongsByArtist(
      artistId,
      currentPage,
      (data) => {
        setBandSongs(data.row);
        setCurrentPage(data.currentPage);
        setRefreshing(false);
      },
      () => {
        setRefreshing(false);
      }
    );
  };

  const emptyList = () => {
    return (
      !loading && (
        <View style={{ padding: "5%", alignItems: "center" }}>
          <Text style={{ color: colors.text }}>Kosong</Text>
        </View>
      )
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader loading={bandSongs != null ? false : true} />
      <View>
        <SongList
          songs={bandSongs}
          onPress={(id) => toViewSong(id)}
          paginate={true}
          handleLoadMore={handleLoadMore}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderEmptyComponent={emptyList}
        />
      </View>
    </View>
  );
}
