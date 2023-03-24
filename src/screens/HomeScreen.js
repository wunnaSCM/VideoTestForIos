import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast } from 'react-native-toast-message';
import MovieCard from '../../components/MovieCard';
import data from '../../json/data.json'
import CryptoJS from 'crypto-js';
import ReactNativeBlobUtil from 'react-native-blob-util'
import Context from '../hooks/Context';

var RNFS = require('react-native-fs');

const HomeScreen = () => {

    const [movieArr, setMovieArr] = useState(data)
    const [id, setId] = useState([])
    const [percentTxt, setPercentTxt] = useState({})

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        readMovie();
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


    const downloadVideo = async (id, url) => {
        console.log('url', url);
        try {
            const { config } = ReactNativeBlobUtil

            config({ fileCache: true, appendExt: 'mp4' })
                .fetch('GET', url)
                .progress((received, total) => {
                    const idAndPercentage = { id: id, percent: Math.round((received / total) * 100) };
                    setPercentTxt(idAndPercentage)
                })
                .then(async response => {
                    console.log('response', response.path())

                    const ENCRYPTED_FILE_PATH = response.path()
                    // const DECRYPTED_FILE_PATH = response.path()

                    // Encrypt
                    // const key = '111111';
                    // const videoData = await RNFS.readFile(response.path(), 'base64');
                    // const encryptedVideoData = CryptoJS.AES.encrypt(videoData, key).toString();
                    // await RNFS.writeFile(ENCRYPTED_FILE_PATH, encryptedVideoData, 'base64');
                    // console.log(`Video file encrypted successfully with key:`, ENCRYPTED_FILE_PATH);

                    // Decrypt
                    // const encrypt = await RNFS.readFile(ENCRYPTED_FILE_PATH, 'base64');
                    // const decryptedVideoData = CryptoJS.AES.decrypt(encrypt, key).toString(CryptoJS.enc.Utf8);
                    // await RNFS.writeFile(DECRYPTED_FILE_PATH, decryptedVideoData, 'base64');
                    // console.log('Video file decrypted successfully', DECRYPTED_FILE_PATH);
                    // console.log('original path ->', response.path())
                    // console.log('encrypt', ENCRYPTED_FILE_PATH)


                    // const item = { downloadUrl: ENCRYPTED_FILE_PATH, decryptedFilePath: `${RNFS.DocumentDirectoryPath}/${id}decryptedVideo.mp4`}
                    const item = {downloadUrl: response.path()}
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

    const removeItem = async (id, url) => {
        try {
            console.log('delete url', url)
            await ReactNativeBlobUtil.fs.unlink(url)
            // await ReactNativeBlobUtil.fs.unlink(decryptedFilePath)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('keys')
            const movies = JSON.parse(result)
            const index = movies.findIndex(obj => obj.id === id)
            const item = { downloadUrl: null }
            movies[index] = { ...movies[index], ...item }
            console.log('inner delete', movies)
            setMovieArr(movies)
            await AsyncStorage.setItem('keys', JSON.stringify(movies))
            console.log('finish deleted')
        } catch (error) {
            console.log('delete err', error)
        }
    }

    const readMovie = async () => {
        const result = await AsyncStorage.getItem('keys')
        const updateData = JSON.parse(result)

        if (result !== null) {
            setMovieArr(updateData)
        }
    }

    return (
        <View style={styles.container}>

            <Context.Provider value={{ id, percentTxt, selectedItems }}>
                <FlatList
                    data={movieArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <MovieCard movie={item} onDownload={() => selectItemsToDownload(item)} onDelete={() => removeItem(item.id, item.downloadUrlPA)} selected={getSelected(item)} item={item} />}
                />
            </Context.Provider>

            <Toast config={toastConfig} />

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})