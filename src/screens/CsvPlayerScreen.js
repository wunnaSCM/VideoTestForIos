import React, { useEffect, useState, useMe } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, NativeModules, Platform } from 'react-native';
import DisplayCsvDataTable from "../../components/DisplayCsvDataTable";
import Loading from "../../components/Loading";

export default function CsvPlayerScreen({ route }) {

    const { csv } = route.params;
    const [isDecrypted, setIsDecrypted] = useState(false)

    const { FileEncryptionModule } = NativeModules
    const { Counter } = NativeModules


    useEffect(() => {
        decrypt()
    }, [])

    const decrypt = async () => {
        const encryptionKey = "S-C-M-MobileTeam"
        const sourceFile = csv.downloadFileUri;
        const desFile = csv.decryptedFilePath;
        console.log('csv', csv)

        try {
            if (Platform.OS == 'android') {
                const proms = await FileEncryptionModule.decryptFile(sourceFile, desFile, encryptionKey)
            } else if (Platform.OS == 'ios') {
                const proms = await Counter.increment(sourceFile, desFile, encryptionKey)
            }
            setIsDecrypted(true)
        } catch (e) {
            console.error(e);
        }
    }



    return (
        <SafeAreaView style={styles.container}>
            {
                isDecrypted ? (
                    <ScrollView>
                        <DisplayCsvDataTable numItemsPerPage={10} csvFileUrl={csv.decryptedFilePath} />
                    </ScrollView>
                ) : (
                    <Loading />
                )
            }

            {/* <ScrollView>
                <DisplayCsvDataTable numItemsPerPage={10} csvFileUrl={csv.decryptedFilePath} />
            </ScrollView> */}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})