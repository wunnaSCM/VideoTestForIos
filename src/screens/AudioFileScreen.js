import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util'
import AudioCard from '../../components/AudioCard';
import Context from '../hooks/Context';
import { fileServices } from '../services/fileServices';
import { API_URL } from '../utils/network/config';

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

    const downloadAudio = async (id) => {

        try {
            const { config } = ReactNativeBlobUtil
            setId(id)
            setIsLoading(true)
            config({ fileCache: true, appendExt: 'mp3' })
                .fetch('GET', API_URL + `/file/${id}`)
                .progress((received, total) => {
                    const idAndPercentage = { id: id, percent: Math.round((received / total) * 100) };
                    setPercentTxt(idAndPercentage)
                })
                .then(async response => {
                    console.log('response', response.path())

                    const item = { downloadFileUri: response.path(), decryptedFilePath: `${RNFS.DocumentDirectoryPath}/${id}decryptedAudio.mp3` }
                    const index = audioArr.findIndex(obj => obj.id === id)

                    audioArr[index] = { ...audioArr[index], ...item }
                    const updated = [...audioArr, audioArr[index]]
                    const removeItem = updated.slice(0, -1)
                    setAudioArr(removeItem)
                    await AsyncStorage.setItem('audioKeys', JSON.stringify(removeItem))
                    setIsLoading(false)
                    console.log('finish')

                })
                .catch(err => console.log(`Error ${err}`))
        } catch (error) {
            console.log(error)
        }
    }

    const removeAudio = async (item) => {
        const url = item.downloadFileUri
        const decryptPath = item.decryptedFilePath
        try {
            ReactNativeBlobUtil.fs.unlink(url)
            ReactNativeBlobUtil.fs.unlink(decryptPath)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('audioKeys')
            const audioFiles = JSON.parse(result)
            const index = audioFiles.findIndex(obj => obj.id === item.id)
            const deleteItem = { downloadFileUri: null, decryptedFilePath: null }
            audioFiles[index] = { ...audioFiles[index], ...deleteItem }
            console.log('inner delete', audioFiles)
            setAudioArr(audioFiles)
            await AsyncStorage.setItem('audioKeys', JSON.stringify(audioFiles))
        } catch (error) {
            console.log('delete err', error)
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <Context.Provider value={{ isLoading, id, percentTxt, downloading }}>
                <FlatList
                    data={audioArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <AudioCard audio={item} onDownload={() => downloadAudio(item.id)} onDelete={() => removeAudio(item)} />}
                />
            </Context.Provider>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
});