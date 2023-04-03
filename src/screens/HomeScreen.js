import { Alert, FlatList, StyleSheet, View, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast } from 'react-native-toast-message';
import MovieCard from '../../components/MovieCard';
import CryptoJS from 'crypto-js';
import ReactNativeBlobUtil from 'react-native-blob-util'
import Context from '../hooks/Context';
import { fileServices } from '../services/fileServices';
import { API_URL } from '../util/network/config';

var RNFS = require('react-native-fs');

const HomeScreen = () => {

    const [movieArr, setMovieArr] = useState([])
    const [id, setId] = useState([])
    const [percentTxt, setPercentTxt] = useState({})

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        fetchMovie();
        console.log('res', movieArr)
        console.log('date', Math.floor(Date.now() / 1000))
    }, [])

    useEffect(() => {
        console.log('select item =>', selectedItems)
    }, [selectedItems])

    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: 'brown' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400'
                }}
            />
        )
    };

    const getSelected = item => selectedItems.includes(item.id);


    const selectItemsToDownload = item => {
        console.log('item =>', item)
        if (selectedItems.includes(item.id)) {
            const newListItems = selectedItems.filter(
                listItem => listItem !== item.id,
            );
            return setSelectedItems([...newListItems]);
        }
        setSelectedItems([...selectedItems, item.id])
        downloadVideo(item.id, item.videoUrl)
    };

    const fetchMovie = async () => {
        const type = 'video'
        const response = await fileServices(type)
        if (response.status == "success") {
            setMovieArr(response.data)
        }

        const result = await AsyncStorage.getItem('keys')
        const updateData = JSON.parse(result)
        if (result !== null) {
            setMovieArr(updateData)
        }
    }

    const downloadVideo = async (id, url) => {
        console.log('url', url);
        try {
            const { config } = ReactNativeBlobUtil

            config({ fileCache: true, appendExt: 'mp4' })
                .fetch('GET', API_URL + `/file/${id}`)
                .progress((received, total) => {
                    const idAndPercentage = { id: id, percent: Math.round((received / total) * 100) };
                    setPercentTxt(idAndPercentage)
                })
                .then(async response => {
                    console.log('response', response.path())

                    const item = { downloadFileUri: response.path(), decryptedFilePath: `${RNFS.DocumentDirectoryPath}/${id}decryptedVideo.mp4` }
                    // const item = {downloadFileUri: response.path()}
                    const index = movieArr.findIndex(obj => obj.id === id)

                    movieArr[index] = { ...movieArr[index], ...item }
                    const updated = [...movieArr, movieArr[index]]
                    const removeItem = updated.slice(0, -1)
                    setMovieArr(removeItem)

                    await AsyncStorage.setItem('keys', JSON.stringify(removeItem))

                    const updatedSelected = selectedItems.filter(itemId => itemId !== id)
                    setSelectedItems(updatedSelected)

                    console.log('selectedItems', selectedItems);
                    console.log('finish')
                })
                .catch(err => console.log(`Error ${err}`))
        } catch (error) {
            console.log(error)
        }
    }

    const removeItem = async (id, url, decryptPath) => {
        try {
            console.log('delete url', url)
            await ReactNativeBlobUtil.fs.unlink(url)
            await ReactNativeBlobUtil.fs.unlink(decryptPath)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('keys')
            const movies = JSON.parse(result)
            const index = movies.findIndex(obj => obj.id === id)
            const item = { downloadFileUri: null, decryptedFilePath: null }
            movies[index] = { ...movies[index], ...item }
            console.log('inner delete', movies)
            setMovieArr(movies)
            await AsyncStorage.setItem('keys', JSON.stringify(movies))
            console.log('finish deleted')
        } catch (error) {
            console.log('delete err', error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <Context.Provider value={{ id, percentTxt, selectedItems }}>
                <FlatList
                    data={movieArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <MovieCard movie={item} onDownload={() => selectItemsToDownload(item)} onDelete={() => removeItem(item.id, item.downloadFileUri, item.decryptedFilePath)} selected={getSelected(item)} item={item} />}
                />
            </Context.Provider>

            <Toast config={toastConfig} />

        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})