import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DisplayCsvDataTable from "../../components/DisplayCsvDataTable";
import FileEncryptionModule from "../modules/FileEncryptionModule";

export default function CsvPlayerScreen({ route }) {

    const { csv } = route.params;
    const [isDecrypted, setIsDecrypted] = useState(false)

    useEffect(() => {
        decrypt()
    }, [])

    const decrypt = async () => {
        const encryptionKey = "S-C-M-MobileTeam"
        const sourceFile = csv.downloadFileUri;
        const desFile = csv.decryptedFilePath;
        console.log('csv', csv)

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
            {
                isDecrypted && (
                    <ScrollView>
                        <DisplayCsvDataTable numItemsPerPage={10} csvFileUrl={csv.decryptedFilePath} />
                    </ScrollView>
                )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})