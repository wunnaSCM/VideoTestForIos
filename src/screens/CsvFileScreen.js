import { FlatList, StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import csvData from '../../json/csvData.json'
import CryptoJS from 'crypto-js';
import ReactNativeBlobUtil from 'react-native-blob-util'
import CsvCard from '../../components/CsvCard';
import Context from '../hooks/Context';

var RNFS = require('react-native-fs');

const CsvFileScreen = () => {

    const [csvArr, setCsvArr] = useState(csvData)
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState()
    const [percentTxt, setPercentTxt] = useState()


    useEffect(() => {
        readCsv();
    }, [])

    const toastConfigCsv = {
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


    const downloadCsv = async (url, id) => {
        console.log('csvUrl', url)

        try {
            const { config } = ReactNativeBlobUtil
            setId(id)
            setIsLoading(true)
            config({ fileCache: true, appendExt: 'csv' })
                .fetch('GET', url)
                .progress((received, total) =>
                    setPercentTxt(Math.round((received / total) * 100))
                )
                .then(async response => {
                    console.log('response', response.path())

                    const ENCRYPTED_FILE_PATH = `${RNFS.DocumentDirectoryPath}/encryptedVideo.csv`;
                    const DECRYPTED_FILE_PATH = response.path()
                    
                    // Encrypt
                    const key = '111111';
                    const videoData = await RNFS.readFile(response.path(), 'base64');
                    const encryptedVideoData = CryptoJS.AES.encrypt(videoData, key).toString();
                    await RNFS.writeFile(ENCRYPTED_FILE_PATH, encryptedVideoData, 'base64');
                    console.log(`Csv file encrypted successfully with key:`, ENCRYPTED_FILE_PATH);

                    // Decrypt
                    const encrypt = await RNFS.readFile(ENCRYPTED_FILE_PATH, 'base64');
                    const decryptedVideoData = CryptoJS.AES.decrypt(encrypt, key).toString(CryptoJS.enc.Utf8);
                    await RNFS.writeFile(DECRYPTED_FILE_PATH, decryptedVideoData, 'base64');
                    console.log('Csv file decrypted successfully', DECRYPTED_FILE_PATH);
                    console.log('original path ->', response.path())

                    const item = { downloadUrl: DECRYPTED_FILE_PATH }
                    const index = csvArr.findIndex(obj => obj.id === id)

                    csvArr[index] = { ...csvArr[index], ...item }
                    const updated = [...csvArr, csvArr[index]]
                    const removeItem = updated.slice(0, -1)
                    setCsvArr(removeItem)
                    await AsyncStorage.setItem('csvKeys', JSON.stringify(removeItem))
                    setIsLoading(false)
                    console.log('finish')

                })
                .catch(err => console.log(`Error ${err}`))
        } catch (error) {
            console.log(error)
        }
    }


    const removeCsv = async (id, url) => {
        try {
            await ReactNativeBlobUtil.fs.unlink(url)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('csvKeys')
            const csvFiles = JSON.parse(result)
            const index = csvFiles.findIndex(obj => obj.id === id)
            const item = { downloadUrl: null }
            csvFiles[index] = { ...csvFiles[index], ...item }
            console.log('inner delete', csvFiles)
            setCsvArr(csvFiles)
            await AsyncStorage.setItem('csvKeys', JSON.stringify(csvFiles))
        } catch (error) {
            console.log('delete err', error)
        }
    }


    const readCsv = async () => {
        const result = await AsyncStorage.getItem('csvKeys')
        const updateData = JSON.parse(result)

        if (result !== null) {
            setCsvArr(updateData)
        }

        console.log('csvArr', csvArr)
    }


    return (
        <View style={styles.container}>          

            <Context.Provider value={{ isLoading, id, percentTxt }}>
                <FlatList
                    data={csvArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <CsvCard csv={item} onDownload={() => downloadCsv(item.url, item.id)} onDelete={() => removeCsv(item.id, item.downloadUrl)} />}
                />
            </Context.Provider>

            <Toast config={toastConfigCsv} />

        </View>
    )
}

export default CsvFileScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})