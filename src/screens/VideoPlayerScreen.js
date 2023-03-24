import { StyleSheet, Text, View, Dimensions, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Video from 'react-native-video'
import CryptoJS from 'crypto-js';
import ReactNativeBlobUtil from 'react-native-blob-util'

var RNFS = require('react-native-fs');

const { width, height } = Dimensions.get('window');


const VideoPlayerScreen = ({ route, navigation }) => {

    const { movie } = route.params;

    const [duration, setDuration] = useState(0);
    const CHUNK_SIZE = 1024 * 1024;

    const [url, setUrl] = useState()

    // useEffect(() => {
    //     if (dec == null) {
    //         decrypt()
    //     }
    //     console.log('dec', dec)
    // }, [])

    const handleLoad = (data) => {
        console.log('data', data)
        setDuration(data.duration);
    };

    const handleProgress = (progress) => {
        console.log('progress', progress)
    }

    const chunkFile = async () => {
        const fileUri = movie.downloadUrl
        console.log('hello', fileUri)
        const fileSize = await ReactNativeBlobUtil.fs.stat(fileUri).then((stats) => stats.size);
        const chunks = Math.ceil(fileSize / CHUNK_SIZE);
        
        // Loop through the file and chunk it
        for (let i = 0; i < chunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, fileSize);
          const chunkUri = `${fileUri}.chunk${i}`;
          console.log('chunkUri', chunkUri)
          
          // Read chunk from file
          const data = await ReactNativeBlobUtil.fs.readFile(fileUri, 'base64', start, end);
      
          // Write chunk to new file
          await ReactNativeBlobUtil.fs.writeFile(chunkUri, data, 'base64');
        }
        setUrl(fileUri)
        console.log(`File ${fileUri} has been chunked into ${chunks} segments`);
        console.log('url', url, fileUri)
      };




    function back() {
        const { goBack } = navigation
        goBack()
    }

    // const decrypt = async () => {
    //     console.log('movie', movie.downloadUrl)
    //     const key = '111111';
    //     const encrypt = await RNFS.readFile(movie.downloadUrl, 'base64');
    //     const decryptedVideoData = CryptoJS.AES.decrypt(encrypt, key).toString(CryptoJS.enc.Utf8);
    //     RNFS.writeFile(movie.decryptedFilePath, decryptedVideoData, 'base64');
    //     console.log('Video file decrypted successfully', movie.decryptedFilePath);
    //     setDec('finish')
    // }


    return (
        <View style={styles.container}>

            {/* {dec == 'finish' ? (
                <Video
                    source={{ uri: movie.decryptedFilePath }}
                    paused={false}
                    repeat={true}
                    style={styles.mediaPlayer}
                    controls={true}
                // onLoad={handleOnLoad}
                />
            ) : (
                <Video
                    source={{ uri: movie.decryptedFilePath }}
                    paused={false}
                    repeat={true}
                    style={styles.mediaPlayer}
                    controls={true}

                />
            )} */}

            <Video
                source={{ uri: movie.downloadUrl }}
                paused={false}
                repeat={true}
                style={styles.mediaPlayer}
                controls={true}
                onLoad={chunkFile}
            />

            {/* <Text>Video duration: {duration} seconds</Text> */}
            {/* <Button title='Chunk' onPress={() => chunkFile(movie.downloadUrl)} /> */}

        </View>
    )
}

export default VideoPlayerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },

    video: {
        width: width,
        height: height / 3,
        marginBottom: 30
    },

    mediaPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
    },
})