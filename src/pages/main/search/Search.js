import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Loader from '../../../components/Loader';
import SongList from '../../../components/SongList';
import { getAdStatus } from '../../../api/AdsApi';
import * as STORAGE from '../../../Storage';
import { searchArtist, searchLagu, loadMore } from '../../../api/SongDbApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { useTheme } from '@react-navigation/native';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1690523413615203/8408167938';

export default function Search({ navigation }) {
    const { colors } = useTheme();
    const [initialLoad, setInitialLoad] = useState(false)
    const [songs, setSongs] = useState(null)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState(null)
    const [showAds, setShowAds] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [email, setEmail] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    React.useEffect(async () => {
        STORAGE.getUserInfo((data) => {
            data && setEmail(data.email)
        })
        getAdStatus((adStatus) => {
            setShowAds(adStatus.searchBannerAd)
        })
    }, [navigation])

    const searchSong = () => {
        setCurrentPage(0)
        setList(null)
        if (query != '') {
            setInitialLoad(true)
            setLoading(true)
            let l = [];
            //SEARCH ARTIST/BAND
            searchArtist(query, (data) => {
                setSongs(data)
                l = data;
            }, () => {
                setInitialLoad(false)
                setRefreshing(false)
            })
            //SEARCH LAGU
            searchLagu(query, (data) => {
                const songs = data.row;
                songs.forEach(song => {
                    l.push(song)
                });
                let i = 1;
                l.forEach(list => {
                    list.key = i;
                    i++;
                })
                setList(l)
                setInitialLoad(false)
                data.currentPage >= data.totalPages && setLoading(false)
                setRefreshing(false)
            }, () => {
                setInitialLoad(false)
                setList(songs)
                setRefreshing(false)
            })
        }
    }

    const toViewSong = (e, created_by, title) => {
        navigation.navigate('ViewSong', {
            path: e,
            created: created_by,
            user: email,
            title: title
        });
    }

    const getSongsByArtist = (id, name) => {
        navigation.navigate('SongsByArtistList', {
            id: id,
            name: name
        });
    }

    const handleLoadMore = async () => {
        loadMore(query, currentPage, (data) => {
            let songs = [...list];
            data.row.forEach(r => {
                songs.push(r)
            });
            setList(songs)
            setCurrentPage(data.currentPage)
            console.log("currentState : " + currentPage)
            console.log("current : " + data.currentPage + ", total : " + data.totalPages)
            data.currentPage >= data.totalPages && setLoading(false)
        }, () => {
            setInitialLoad(false)
        })
    }

    const onRefresh = () => {
        setRefreshing(true)
        searchSong()
    }

    return (
        <View style={{ flex: 1 }}>
            <Loader loading={initialLoad} />
            <View style={{ flex: 1, flexDirection: 'row', elevation: 20, margin: '5%', backgroundColor:colors.card, alignItems: 'center', borderRadius: 30 }}>
                <Ionicons name='search' color={colors.text} style={{ marginHorizontal: '5%', fontSize: 27 }} />
                <TextInput
                    placeholderTextColor={colors.text}
                    onEndEditing={searchSong}
                    onChangeText={(text) => setQuery(text)}
                    placeholder='Cari Chord'
                    style={{ width: '75%', color:colors.text }}
                />
            </View>
            <View style={{ flex: 11 }}>
                <SongList
                    songs={list}
                    onPress={(e, created_by, title) => toViewSong(e, created_by, title)}
                    onArtistPress={(id, name) => getSongsByArtist(id, name)}
                    handleLoadMore={() => handleLoadMore()}
                    loading={loading}
                    search
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            </View>
            {
                showAds ?
                    <View style={{ flex: 1 }}>
                        <BannerAd
                            unitId={adUnitId}
                            size={BannerAdSize.FULL_BANNER}
                            requestOptions={{
                                requestNonPersonalizedAdsOnly: true,
                            }}
                            onAdFailedToLoad={(error) => console.log(error)}
                        />
                    </View>
                    :
                    <View />
            }
        </View>
    );

}

const styles = StyleSheet.create({
    content: {
        padding: 10
    }
})