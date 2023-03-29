import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Pdf from 'react-native-pdf';
import FileEncryptionModule from '../modules/FileEncryptionModule';


const PdfPlayerScreen = ({ route }) => {

    const { pdf } = route.params;
    const [isDecrypted, setIsDecrypted] = useState(false)
    const source = { uri: pdf.decryptedFilePath, cache: true };

    useEffect(() => {
        decrypt()
    }, [])

    const decrypt = async () => {
        const encryptionKey = "S-C-M-MobileTeam"
        const sourceFile = pdf.downloadFileUri;
        const desFile = pdf.decryptedFilePath;

        console.log(pdf)
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
                    <Pdf
                        trustAllCerts={false}
                        source={source}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link pressed: ${uri}`)
                        }}
                        style={styles.pdf}
                    />
                )
            }

        </View>
    );
}



export default PdfPlayerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,

    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})