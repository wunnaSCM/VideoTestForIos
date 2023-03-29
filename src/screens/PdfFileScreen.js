import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from 'react-native'
import Toast, { BaseToast } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import ReactNativeBlobUtil from 'react-native-blob-util'
import PdfCard from "../../components/PdfCard";
import Context from "../hooks/Context";
import { fileServices } from '../services/fileServices';
import { API_URL } from '../util/network/config';

var RNFS = require('react-native-fs');

export default function PdfFileScreen() {

    const [pdfArr, setPdfArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState()
    const [percentTxt, setPercentTxt] = useState()


    useEffect(() => {
        fetchPdf()
        console.log('pdrArr', pdfArr)
    }, [])

    const toastConfigPdf = {
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

    const fetchPdf = async () => {
        const type = 'pdf'
        const response = await fileServices(type)
        if (response.status == "success") {
            setPdfArr(response.data)
        }

        const result = await AsyncStorage.getItem('pdfKeys')
        const updateData = JSON.parse(result)
        if (result !== null) {
            setPdfArr(updateData)
        }
    }


    const downloadPdf = async (url, id) => {

        try {
            const { config } = ReactNativeBlobUtil
            setId(id)
            setIsLoading(true)
            config({ fileCache: true, appendExt: 'pdf' })
                .fetch('GET', API_URL + `file/${id}`)
                .progress((received, total) =>
                    setPercentTxt(Math.round((received / total) * 100))
                )
                .then(async response => {
                    console.log('response', response.path())

                    const ENCRYPTED_FILE_PATH = `${RNFS.DocumentDirectoryPath}/encryptedVideo.pdf`;
                    const DECRYPTED_FILE_PATH = response.path()

                    // Encrypt
                    const key = '111111';
                    const videoData = await RNFS.readFile(response.path(), 'base64');
                    const encryptedVideoData = CryptoJS.AES.encrypt(videoData, key).toString();
                    await RNFS.writeFile(ENCRYPTED_FILE_PATH, encryptedVideoData, 'base64');
                    console.log(`Pdf file encrypted successfully with key:`, ENCRYPTED_FILE_PATH);

                    // Decrypt
                    const encrypt = await RNFS.readFile(ENCRYPTED_FILE_PATH, 'base64');
                    const decryptedVideoData = CryptoJS.AES.decrypt(encrypt, key).toString(CryptoJS.enc.Utf8);
                    await RNFS.writeFile(DECRYPTED_FILE_PATH, decryptedVideoData, 'base64');
                    console.log('Pdf file decrypted successfully', DECRYPTED_FILE_PATH);
                    console.log('original path ->', response.path())


                    const item = { downloadUrl: DECRYPTED_FILE_PATH }
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

    const removePdf = async (id, url) => {
        try {
            await ReactNativeBlobUtil.fs.unlink(url)
            console.log('File deleted')

            const result = await AsyncStorage.getItem('pdfKeys')
            const pdfs = JSON.parse(result)
            const index = pdfs.findIndex(obj => obj.id === id)
            const item = { downloadUrl: null }
            pdfs[index] = { ...pdfs[index], ...item }
            console.log('inner delete', pdfs)
            setPdfArr(pdfs)
            await AsyncStorage.setItem('pdfKeys', JSON.stringify(pdfs))
        } catch (error) {
            console.log('delete err', error)
        }
    }

    return (
        <View>

            <Context.Provider value={{ isLoading, id, percentTxt }}>
                <FlatList
                    data={pdfArr}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <PdfCard pdf={item} onDownload={() => downloadPdf(item.url, item.id)} onDelete={() => removePdf(item.id, item.url)} />}
                />
            </Context.Provider>

            <Toast config={toastConfigPdf} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})
