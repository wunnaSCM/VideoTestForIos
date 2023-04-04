import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util'
import PdfCard from "../../components/PdfCard";
import Context from "../hooks/Context";
import { fileServices } from '../services/fileServices';
import { API_URL } from '../utils/network/config';

var RNFS = require('react-native-fs');

export default function PdfFileScreen() {

    const [pdfArr, setPdfArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState()
    const [percentTxt, setPercentTxt] = useState()


    useEffect(() => {
        fetchPdf()
    }, [])

    const fetchPdf = async () => {
        const type = 'pdf'
        const response = await fileServices(type)
        if (response.status == "success") {
            console.log('response data', response.data)
            setPdfArr(response.data)
        }

        const result = await AsyncStorage.getItem('pdfKeys')
        const updateData = JSON.parse(result)
        if (result !== null) {
            setPdfArr(updateData)
        }
        console.log('pdf result =>', pdfArr)
    }


    const downloadPdf = async (id) => {
        try {
            const { config } = ReactNativeBlobUtil
            setId(id)
            setIsLoading(true)
            config({ fileCache: true, appendExt: 'pdf' })
                .fetch('GET', API_URL + `/file/${id}`)
                .progress((received, total) => {
                    const idAndPercentage = { id: id, percent: Math.round((received / total) * 100) };
                    setPercentTxt(idAndPercentage)
                })
                .then(async response => {
                    console.log('response', response.path())

                    const item = { downloadFileUri: response.path(), decryptedFilePath: `${RNFS.DocumentDirectoryPath}/${id}decryptedPdf.pdf` }
                    const index = pdfArr.findIndex(obj => obj.id === id)

                    pdfArr[index] = { ...pdfArr[index], ...item }
                    const updated = [...pdfArr, pdfArr[index]]
                    const removeItem = updated.slice(0, -1)
                    setPdfArr(removeItem)

                    await AsyncStorage.setItem('pdfKeys', JSON.stringify(removeItem))
                    setIsLoading(false)
                    console.log('finish')
                })
                .catch(err => console.log(`Error ${err}`))
        } catch (error) {
            console.log(error)
        }
    }

    const removePdf = async (item) => {
        console.log('delete item -> ', item.id)
        const url = item.downloadFileUri
        const decryptPath = item.decryptedFilePath
        try {
            const resUrl = ReactNativeBlobUtil.fs.unlink(url)
            const resPath = ReactNativeBlobUtil.fs.unlink(decryptPath)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('pdfKeys')
            const pdfs = JSON.parse(result)
            const index = pdfs.findIndex(obj => obj.id === item.id)
            const deleteItem = { downloadFileUri: null, decryptedFilePath: null}
            pdfs[index] = { ...pdfs[index], ...deleteItem }
            console.log('inner delete', pdfs)
            setPdfArr(pdfs)
            await AsyncStorage.setItem('pdfKeys', JSON.stringify(pdfs))
        } catch (error) {
            console.log('delete err', error)
        }

    }

    return (
        <SafeAreaView>

            <Context.Provider value={{ isLoading, id, percentTxt }}>
                <FlatList
                    data={pdfArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <PdfCard pdf={item} onDownload={() => downloadPdf(item.id)} onDelete={() => removePdf(item)} />}
                />
            </Context.Provider>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})
