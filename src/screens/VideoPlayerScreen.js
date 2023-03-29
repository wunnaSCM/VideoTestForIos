import { StyleSheet, Text, View, Dimensions, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Video from 'react-native-video'
import FileEncryptionModule from '../modules/FileEncryptionModule';

var RNFS = require('react-native-fs');

const { width, height } = Dimensions.get('window');


const VideoPlayerScreen = ({ route, navigation }) => {

    const { movie } = route.params;
    const { isDecrypted, setIsDecrypted } = useState(false)


    useEffect(() => {
       decrypt()
    }, [])


    function back() {
        const { goBack } = navigation
        goBack()
    }

    const decrypt = async () => {

        const encryptionKey = "S-C-M-MobileTeam"
        const sourceFile = movie.downloadFileUri;
        const desFile = movie.decryptedFilePath;
        try {
            const proms = await FileEncryptionModule.decryptFile(sourceFile, desFile, encryptionKey)
            setIsDecrypted(true)
            console.log(`${proms}`);
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <View style={styles.container}>
            <Video
                source={{ uri: movie.decryptedFilePath }}
                paused={false}
                repeat={true}
                style={styles.mediaPlayer}
                controls={true}
            />
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