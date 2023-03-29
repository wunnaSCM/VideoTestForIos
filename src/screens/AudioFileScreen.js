import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import ReactNativeBlobUtil from 'react-native-blob-util'
import CryptoJS from 'crypto-js';
import AudioCard from '../../components/AudioCard';
import Context from '../hooks/Context';
import { fileServices } from '../services/fileServices';
import { API_URL } from '../util/network/config';

var RNFS = require('react-native-fs');

export default function AudioFileScreen() {

    const [audioArr, setAudioArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState()
    const [percentTxt, setPercentTxt] = useState()
    const [downloading, setDownloading] = useState(false)


    useEffect(() => {
        fetchAudio()
        console.log('audioArr', audioArr)
    }, [])

    const toastConfigAudio = {
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

    const fetchAudio = async () => {
        const type = 'audio'
        const response = await fileServices(type)
        if (response.status == "success") {
            setAudioArr(response.data)
        }

        const result = await AsyncStorage.getItem('audioKeys')
        const updateData = JSON.parse(result)
        if (result !== null) {
            setAudioArr(updateData)
        }
    }

    const downloadAudio = async (url, id) => {

        try {
            const { config } = ReactNativeBlobUtil
            setDownloading(true)
            setId(id)
            setIsLoading(true)
            config({ fileCache: true, appendExt: 'mp3' })
                .fetch('GET', API_URL + `file/${id}`)
                .progress((received, total) =>
                    setPercentTxt(Math.round((received / total) * 100))
                )
                .then(async response => {
                    console.log('response', response)

                    const ENCRYPTED_FILE_PATH = `${RNFS.DocumentDirectoryPath}/encryptedVideo.mp3`;
                    const DECRYPTED_FILE_PATH = response.path()

                    // Encrypt
                    const key = '111111';
                    const videoData = await RNFS.readFile(response.path(), 'base64');
                    const encryptedVideoData = CryptoJS.AES.encrypt(videoData, key).toString();
                    await RNFS.writeFile(ENCRYPTED_FILE_PATH, encryptedVideoData, 'base64');
                    console.log(`Audio file encrypted successfully with key:`, ENCRYPTED_FILE_PATH);

                    // Decrypt
                    const encrypt = await RNFS.readFile(ENCRYPTED_FILE_PATH, 'base64');
                    const decryptedVideoData = CryptoJS.AES.decrypt(encrypt, key).toString(CryptoJS.enc.Utf8);
                    await RNFS.writeFile(DECRYPTED_FILE_PATH, decryptedVideoData, 'base64');
                    console.log('Audio file decrypted successfully', DECRYPTED_FILE_PATH);
                    console.log('original path ->', response.path())

                    const item = { downloadUrl: DECRYPTED_FILE_PATH }
                    const index = audioArr.findIndex(obj => obj.id === id)

                    audioArr[index] = { ...audioArr[index], ...item }
                    const updated = [...audioArr, audioArr[index]]
                    const removeItem = updated.slice(0, -1)
                    setAudioArr(removeItem)
                    await AsyncStorage.setItem('audioKeys', JSON.stringify(removeItem))
                    setDownloading(false)
                    setIsLoading(false)
                    console.log('finish')

                })
                .catch(err => console.log(`Error ${err}`))
        } catch (error) {
            console.log(error)
        }

        // console.log('content', content)
    }

    const removeAudio = async (id, url) => {
        try {
            await ReactNativeBlobUtil.fs.unlink(url)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('audioKeys')
            const audioFiles = JSON.parse(result)
            const index = audioFiles.findIndex(obj => obj.id === id)
            const item = { downloadUrl: null }
            audioFiles[index] = { ...audioFiles[index], ...item }
            console.log('inner delete', audioFiles)
            setAudioArr(audioFiles)
            await AsyncStorage.setItem('audioKeys', JSON.stringify(audioFiles))
        } catch (error) {
            console.log('delete err', error)
        }
    }




    return (
        <View style={styles.container}>
            <Context.Provider value={{ isLoading, id, percentTxt, downloading }}>
                <FlatList
                    data={audioArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <AudioCard audio={item} onDownload={() => downloadAudio(item.url, item.id)} onDelete={() => removeAudio(item.id, item.url)} />}
                />
            </Context.Provider>

            <Toast config={toastConfigAudio} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
});