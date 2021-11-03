import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import Loader from '../../../components/Loader';
import SongList from '../../../components/SongList';
import { getAdStatus } from '../../../api/AdsApi';
import { addSearchList } from '../../../api/SongsApi';
import * as STORAGE from '../../../Storage';
import { searchArtist, searchLagu, loadMore } from '../../../api/SongDbApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { useTheme } from '@react-navigation/native';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1690523413615203/8408167938';

export default function Search({ navigation, route }) {
    const { colors } = useTheme();
    const [initialLoad, setInitialLoad] = useState(false)
    const [songs, setSongs] = useState(null)
    const [query, setQuery] = useState(route.params.query)
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState(null)
    const [showAds, setShowAds] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [email, setEmail] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [contentFlex, setcontentFlex] = useState(15);

    React.useEffect(async () => {
        STORAGE.getUserInfo((data) => {
            data && setEmail(data.email)
        })
        getAdStatus((adStatus) => {
            adStatus ? setcontentFlex(13) : setcontentFlex(15)
            setShowAds(adStatus.searchBannerAd)
        })
        searchSong()
    }, [navigation])

    const searchSong = () => {
        setCurrentPage(0)
        setList(null)
        if (query != '') {
            setInitialLoad(true)
            setLoading(true)
            //SEARCH ARTIST/BAND
            searchArtist(query, (data) => {
                setSongs(data)
                let l = data;
                //SEARCH LAGU
                searchLagu(query, (data) => {
                    if (data.totalItems == 0) {
                        let search = {
                            'query': query,
                            'date': new Date(),
                            'user': email
                        }
                        addSearchList(search, () => console.log('ditambahkan ke search firestore'))
                    }
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
                    setList(songs)
                })
            }, () => {
                setInitialLoad(false)
                setRefreshing(false)
            })
        }
    }

    const toViewSong = (id) => {
        navigation.navigate('ViewSong', {
            id: id,
            user: email
        });
    }

    const getSongsByArtist = (id, name) => {
        navigation.navigate('SongsByArtistList', {
            id: id,
            name: name,
            user: email
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
            data.currentPage >= data.totalPages && setLoading(false)
        }, () => {
            setInitialLoad(false)
        })
    }

    const onRefresh = () => {
        setRefreshing(true)
        searchSong()
    }

    const emptyList = () => {
        return (
            !loading &&
            <View style={{ padding: '5%', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: colors.text }}>Pencarian tidak ditemukan</Text>
                <Text siz style={{ fontSize: 11, color: colors.text }}>data akan segera diperbaharui</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Loader loading={initialLoad} />
            <View style={{ flex: 1, flexDirection: 'row', elevation: 20, margin: '5%', backgroundColor: colors.card, alignItems: 'center', borderRadius: 30 }}>
                <Ionicons name='search' color={colors.text} style={{ marginHorizontal: '5%', fontSize: 27 }} />
                <TextInput
                    placeholderTextColor={colors.text}
                    onEndEditing={searchSong}
                    onChangeText={(text) => setQuery(text)}
                    value={query}
                    placeholder='Cari Chord'
                    style={{ width: '75%', color: colors.text }}
                />
            </View>
            <View style={{ flex: contentFlex }}>
                <SongList
                    songs={list}
                    onPress={(id) => toViewSong(id)}
                    onArtistPress={(id, name) => getSongsByArtist(id, name)}
                    handleLoadMore={() => handleLoadMore()}
                    loading={loading}
                    paginate={true}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    renderEmptyComponent={emptyList}
                />
            </View>
            {
                showAds ?
                    <View style={{ flex: 1.5 }}>
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