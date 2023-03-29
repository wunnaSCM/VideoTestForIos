import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';

const CHUNK_SIZE = 1024 * 1024; // 1 MB

const ChunkedVideoPlayer = () => {

    const [videoUri, setVideoUri] = useState(null);

    const downloadVideo = async () => {
        const url = 'https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/sample-mp4-file.mp4'; // URL of the video to download
        const response = await fetch(url);
        const totalSize = Number(response.headers.get('content-length'));
        const chunks = [];
        let downloadedSize = 0;

        while (downloadedSize < totalSize) {
            const chunkStart = downloadedSize;
            const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, totalSize) - 1;
            const headers = { Range: `bytes=${chunkStart}-${chunkEnd}` };
            const chunkResponse = await fetch(url, { headers });
            const chunk = await chunkResponse.arrayBuffer();
            chunks.push(chunk);
            downloadedSize += chunk.byteLength;
        }

        const concatenatedChunks = new Uint8Array(downloadedSize);
        let offset = 0;

        for (const chunk of chunks) {
            concatenatedChunks.set(new Uint8Array(chunk),  );
            offset += chunk.byteLength;
        }

        const videoBlob = new Blob([concatenatedChunks], { type: 'video/mp4' });
        const videoUri = URL.createObjectURL(videoBlob);
        setVideoUri(videoUri);
    };

    return (
        <View style={styles.container}>
            {videoUri ? (
                <Video source={{ uri: videoUri }} style={{ width: 320, height: 240 }} />
            ) : (
                <TouchableOpacity onPress={downloadVideo}>
                    <Text>Download Video</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: 300,
    },
});

export default ChunkedVideoPlayer;
