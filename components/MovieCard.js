import React, { useState, useEffect, useContext } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text, Button, Image } from 'react-native';
import { Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Loading from "./Loading";
import Context from "../src/hooks/Context";
import { API_URL } from "../src/util/network/config";


const MovieCard = ({ movie, onDownload, onDelete, selected }) => {

    const navigation = useNavigation();
    const [showSize, setShowSize] = useState()
    const { percentTxt, selectedItems } = useContext(Context)

    const [downloadPercent, setDownloadPercent] = useState(0)

    useEffect(() => {
        fetch(API_URL + `/file/${movie.id}`, {
            method: 'HEAD'
        }).then(response => {
            // console.log('res', response);
            const sizeInBytes = response.headers.get('content-length');
            const sizeInMb = sizeInBytes / (1024 * 1024);
            setShowSize(sizeInMb.toFixed(2));
        })
    }, [movie.videoUrl])

    useEffect(() => {
        if (percentTxt && percentTxt.id == movie.id) {
            setDownloadPercent(percentTxt.percent);
        }
    }, [percentTxt])

    useEffect(() => {
        console.log('movie percent', movie.id)
    }, [])

    const cardOnPress = () => {
        if (movie.downloadFileUri != null) {
            navigation.navigate('VideoPlayer', { movie: movie })
        } else {
            showToast()
        }
        // navigation.navigate('VideoPlayer', { movie: movie })
    }

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Video is not downloaded',
        });
    }

    async function getFileSize(fileUri) {
        let fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log('file', fileInfo.size)
        return fileInfo.size;
    };

    const showConfirmDialog = () => {
        return Alert.alert(
            "Delete Video?",
            `${movie.title} video will be deleted from download`,
            [
                {
                    text: "Yes",
                    onPress: () => { onDelete() },
                },

                {
                    text: "No",
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>

                <TouchableOpacity onPress={cardOnPress} style={styles.cardLayout}>
                    <View>
                        <Card.Cover source={{ uri: movie.thumbnail }} style={styles.image} />
                        {movie.downloadFileUri != null && (
                            <TouchableOpacity onPress={() => showConfirmDialog()} style={styles.absolute}>
                                <MaterialCommunityIcons name="delete-circle" color="red" size={45} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Card.Title title={movie.title} titleStyle={{ color: "#000" }} />
                    <Card.Actions style={{ marginTop: -10 }}>
                        <View style={styles.textAbsolute}>
                            <Text style={{ color: 'black' }}>{showSize} MB</Text>
                        </View>
                        {movie.downloadFileUri != null ? (
                            <View>
                                <MaterialCommunityIcons name="check-circle" color="black" size={30} />
                            </View>
                        ) : (
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onDownload(movie)
                                }}>
                                    <MaterialIcon name="file-download" size={30} color="black" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </Card.Actions>
                </TouchableOpacity>

                { selected ? (
                        <View style={styles.loadingLayout}>
                            <Loading />
                            <Text style={styles.loadingText}>{downloadPercent} %</Text>
                            <Text style={styles.loadingText}>Downloading... </Text>
                        </View>
                    ) : (
                       null
                    )
                }

            </Card>
        </View>
    )
}

export default MovieCard


const styles = StyleSheet.create({
    container: {
        width: "45%",
        margin: 10,
    },

    card: {
        width: "100%",
        // padding: 10,
        overflow: "hidden",
        backgroundColor: '#eee'
    },

    loadingLayout: {
        position: 'absolute',
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },

    loadingText: {
        color: "white",
        marginTop: 5,
    },

    cardLayout: {
        padding: 10,
    },

    image: {
        backgroundColor: '#555',
        position: 'relative',
    },

    absolute: {
        position: 'absolute',
        right: 10,
        top: 10
    },

    loading: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: -40
    },

    textAbsolute: {
        marginLeft: 0,
        left: 15,
        position: 'absolute'
    }
})