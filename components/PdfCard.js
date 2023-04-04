import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native'
import { Card } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Context from "../src/hooks/Context";
import Loading from "./Loading";
import { API_URL } from "../src/utils/network/config";
import CryptoJS from 'crypto-js';

var RNFS = require('react-native-fs');

export default function PdfCard({ pdf, onDownload, onDelete }) {

    const navigation = useNavigation();
    const [showSize, setShowSize] = useState()
    const { isLoading, id, percentTxt } = useContext(Context)
    const [downloadPercent, setDownloadPercent] = useState(0)

    useEffect(() => {
        fetch(API_URL + `/file/${pdf.id}`, {
            method: 'HEAD'
        }).then(response => {
            const sizeInBytes = response.headers.get('content-length');
            const sizeInMb = sizeInBytes / (1024 * 1024);
            setShowSize(sizeInMb.toFixed(2));
        })
    }, [pdf.url])

    useEffect(() => {
        if (percentTxt && percentTxt.id == pdf.id) {
            setDownloadPercent(percentTxt.percent);
        }
    }, [percentTxt])

    const cardOnPress = async () => {
        if (pdf.downloadFileUri != null) {
            navigation.navigate('PdfPlayer', {pdf : pdf })
            console.log('hello')
            const videoData = await RNFS.readFile(pdf.downloadUrl, 'base64')
        } else {
            showToast()
        }
    }

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'PDF file is not downloaded',
        });
    }


    const showConfirmDialog = () => {
        return Alert.alert(
            "Delete Pdf file?",
            `${pdf.title} pdf file will be deleted from download`,
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
        <SafeAreaView style={styles.container}>
            <Card style={styles.card}>
                <TouchableOpacity onPress={cardOnPress} style={styles.cardLayout}>
                    <View>
                        <Card.Cover source={{ uri: pdf.thumbnail }} style={styles.image} />
                        {pdf.downloadFileUri != null && (
                            <TouchableOpacity onPress={() => showConfirmDialog()} style={styles.absolute}>
                                <MaterialCommunityIcons name="delete-circle" color="red" size={45} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Card.Title title={pdf.title} titleStyle={{ color: "#000" }} />
                    <Card.Actions style={{ marginTop: -10 }}>
                        <View style={styles.textAbsolute}>
                            <Text style={{ color: 'black' }}>{showSize} MB</Text>
                        </View>
                        {pdf.downloadFileUri != null ? (
                            <View>
                                <MaterialCommunityIcons name="check-circle" color="black" size={30} />
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                onDownload(pdf)
                            }
                            }>
                                <MaterialIcon name="file-download" size={30} color="black" />
                            </TouchableOpacity>
                        )}
                    </Card.Actions>
                </TouchableOpacity>

                {
                    id == pdf.id && isLoading == true ? (
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
        </SafeAreaView>
    )
}

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