import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { Card } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Context from "../src/hooks/Context";
import Loading from "./Loading";
import base64 from 'react-native-base64'
import CryptoJS from 'crypto-js';

var forge = require('node-forge');
var RNFS = require('react-native-fs');

export default function CsvCard({ csv, onDownload, onDelete }) {

    const navigation = useNavigation();
    const [showSize, setShowSize] = useState()
    const { isLoading, id, percentTxt } = useContext(Context)

    useEffect(() => {
        fetch(csv.url, {
            method: 'HEAD'
        }).then(response => {
            const sizeInBytes = response.headers.get('content-length');
            const sizeInMb = sizeInBytes / (1024 * 1024);
            setShowSize(sizeInMb.toFixed(2));
        })
    }, [csv.url])

    const cardOnPress = async () => {
        if (csv.downloadFileUri != null) {
            navigation.navigate('CsvPlayer', { csv: csv })
            console.log('hello')
            const videoData = await RNFS.readFile(csv.downloadUrl, 'base64')
        } else {
            showToast()
        }
    }

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'CSV file is not downloaded',
        });
    }


    const showConfirmDialog = () => {
        return Alert.alert(
            "Delete Csv file?",
            `${csv.title} csv file will be deleted from download`,
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
                        <Card.Cover source={{ uri: csv.thumbnail }} style={styles.image} />
                        {csv.downloadFileUri != null && (
                            <TouchableOpacity onPress={() => showConfirmDialog()} style={styles.absolute}>
                                <MaterialCommunityIcons name="delete-circle" color="red" size={45} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Card.Title title={csv.title} titleStyle={{ color: "#000" }} />
                    <Card.Actions style={{ marginTop: -10 }}>
                        <View style={styles.textAbsolute}>
                            <Text style={{ color: 'black' }}>{showSize} MB</Text>
                        </View>
                        {csv.downloadFileUri != null ? (
                            <View>
                                <MaterialCommunityIcons name="check-circle" color="black" size={30} />
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                onDownload(csv)
                            }
                            }>
                                <MaterialIcon name="file-download" size={30} color="black" />
                            </TouchableOpacity>
                        )}
                    </Card.Actions>
                </TouchableOpacity>

                {
                    id == csv.id && isLoading == true ? (
                        <View style={styles.loadingLayout}>
                            <Loading />
                            <Text style={styles.loadingText}>{percentTxt} %</Text>
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