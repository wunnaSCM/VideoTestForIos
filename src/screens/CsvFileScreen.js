import { FlatList, StyleSheet, Text, View, SafeAreaView, NativeModules} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util'
import CsvCard from '../../components/CsvCard';
import Context from '../hooks/Context';
import { fileServices } from '../services/fileServices';
import { API_URL } from '../utils/network/config';

var RNFS = require('react-native-fs');

const CsvFileScreen = () => {

    const [csvArr, setCsvArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState()
    const [percentTxt, setPercentTxt] = useState()


    useEffect(() => {
        fetchCsv();
    }, [])


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

    const removeCsv = async (item) => {
        console.log('delete item -> ', item.id)
        const url = item.downloadFileUri
        const decryptPath = item.decryptedFilePath
        try {
            ReactNativeBlobUtil.fs.unlink(url)
            ReactNativeBlobUtil.fs.unlink(decryptPath)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('csvKeys')
            const csvs = JSON.parse(result)
            const index = csvs.findIndex(obj => obj.id === item.id)
            const deleteItem = { downloadFileUri: null, decryptedFilePath: null}
            csvs[index] = { ...csvs[index], ...deleteItem }
            console.log('inner delete', csvs)
            setCsvArr(csvs)
            await AsyncStorage.setItem('csvKeys', JSON.stringify(csvs))
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
                    renderItem={({ item }) => <CsvCard csv={item} onDownload={() => downloadCsv(item.id)} onDelete={() => removeCsv(item)} />}
                />
            </Context.Provider>

        </SafeAreaView>
    )
}

export default CsvFileScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})