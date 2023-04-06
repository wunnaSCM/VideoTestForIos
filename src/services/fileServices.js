import { API_URL } from "../utils/network/config";
import ReactNativeBlobUtil from 'react-native-blob-util'

var RNFS = require('react-native-fs');

export async function fileServices(type) {
    const res = await fetch(API_URL + `/${type}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((json) => {
            json.status = "success";
            return json;
        })
        .catch((error) => {
            console.log('network error', error);
            return error;
        });
    return res;
}

export async function downloadFile(id, type) {

    const { config } = ReactNativeBlobUtil

    const innerDownload = config({ fileCache: true, appendExt: type })
        .fetch('GET', API_URL + `/file/${id}`)
        .progress((received, total) => {
            const idAndPercentage = { id: id, percent: Math.round((received / total) * 100) };
            return idAndPercentage;
        })
        .then(async response => {
            const item = { downloadFileUri: response.path(), decryptedFilePath: `${RNFS.DocumentDirectoryPath}/${id}decrypted.${type}` }
            console.log('finish')
            return item;
        })
        .catch(err => console.log(`Error ${err}`))
    return innerDownload;

}