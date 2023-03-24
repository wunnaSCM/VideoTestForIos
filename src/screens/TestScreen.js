import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';

export default function TestScreen() {

    const chunkSize = 1024 * 1024 * 10; 
    
    const chunkVideo = async () => {
        console.log('chunk')
        const filePath = "https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/sample-mp4-file.mp4"
        const stats = await RNFS.stat(filePath);
        const fileSize = stats.size;
        const numChunks = Math.ceil(fileSize / chunkSize);
        
        const chunks = [];
        let start = 0;
        let end = chunkSize;
        
        for (let i = 0; i < numChunks; i++) {
          if (end >= fileSize) {
            end = fileSize;
          }
          
          const chunkFilePath = `${RNFS.DocumentDirectoryPath}/chunk_${i}.mp4`;
          await RNFS.copyFile(filePath, chunkFilePath, start, end - start);
          chunks.push(chunkFilePath);
          
          start = end;
          end += chunkSize;
    }
}

    return (
        <View style={styles.container}>
            <Text> TestScreen </Text>
            <Button title='Test' onPress={chunkVideo} />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
