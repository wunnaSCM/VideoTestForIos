import { FlatList, StyleSheet, Text, View, SafeAreaView, NativeModules} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast } from 'react-native-toast-message';
import CryptoJS from 'crypto-js';
import ReactNativeBlobUtil from 'react-native-blob-util'
import CsvCard from '../../components/CsvCard';
import Context from '../hooks/Context';
import { fileServices } from '../services/fileServices';
import { API_URL } from '../util/network/config';
import Loading from '../../components/Loading';


var RNFS = require('react-native-fs');

const CsvFileScreen = () => {

    const [csvArr, setCsvArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState()
    const [percentTxt, setPercentTxt] = useState()

    const { Counter } = NativeModules

    useEffect(() => {
        fetchCsv();
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

    const fetchCsv = async () => {
        const type = 'csv'
        console.log("calling blah blah");
        const response = await fileServices(type)
        if (response.status == "success") {
            setCsvArr(response.data)
        }

        const result = await AsyncStorage.getItem('csvKeys')
        const updateData = JSON.parse(result)
        if (result !== null) {
            setCsvArr(updateData)
        }
        console.log('csvArr', csvArr)
    }

    const downloadCsv = async (id) => {

        try {
            const { config } = ReactNativeBlobUtil
            setId(id)
            setIsLoading(true)
            config({ fileCache: true, appendExt: 'csv' })
                .fetch('GET', API_URL + `/file/${id}`)
                .progress((received, total) => {
                    const idAndPercentage = { id: id, percent: Math.round((received / total) * 100) };
                    setPercentTxt(idAndPercentage)
                })
                .then(async response => {
                    console.log('response', response.path())
                    
                    const item = { downloadFileUri: response.path(), decryptedFilePath: `${RNFS.DocumentDirectoryPath}/${id}decryptedCsv.csv` }
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

    const removeCsv = async (id, url, decryptPath) => {
        console.log(id, url, decryptPath)
        try {
            await ReactNativeBlobUtil.fs.unlink(url)
            await ReactNativeBlobUtil.fs.unlink(decryptPath)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('csvKeys')
            const csvFiles = JSON.parse(result)
            const index = csvFiles.findIndex(obj => obj.id === id)
            const item = { downloadFileUri: null, decryptedFilePath: null }
            csvFiles[index] = { ...csvFiles[index], ...item }
            console.log('inner delete', csvFiles)
            setCsvArr(csvFiles)
            await AsyncStorage.setItem('csvKeys', JSON.stringify(csvFiles))
        } catch (error) {
            console.log('delete err', error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Context.Provider value={{ isLoading, id, percentTxt }}>
                <FlatList
                    data={csvArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <CsvCard csv={item} onDownload={() => downloadCsv(item.id)} onDelete={() => removeCsv(item.id, item.downloadFileUri, item.decryptedFilePath)} />}
                />
            </Context.Provider>

            <Toast config={toastConfigCsv} />

        </SafeAreaView>
    )
}

export default CsvFileScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})