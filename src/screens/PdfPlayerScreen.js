import { StyleSheet, Text, View, Dimensions, NativeModules, SafeAreaView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Pdf from 'react-native-pdf';
import Loading from '../../components/Loading';


const PdfPlayerScreen = ({ route }) => {

    const { pdf } = route.params;
    const [isDecrypted, setIsDecrypted] = useState(false)
    //const source = { uri: pdf.downloadFileUri, cache: true};
    const source = { uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf", cache: true }

    const { Counter } = NativeModules
    const { FileEncryptionModule } = NativeModules

    useEffect(() => {
        decrypt()
        console.log('link', pdf.decryptedFilePath, pdf.downloadFileUri)
    }, [])

    const decrypt = async () => {
        const encryptionKey = "S-C-M-MobileTeam"
        const sourceFile = pdf.downloadFileUri;
        const desFile = pdf.decryptedFilePath;
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
                    <>
                        <Pdf
                            trustAllCerts={false}
                            source={{ uri: pdf.decryptedFilePath, cache: true }}
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
                    </>
                ) : (
                    <View style={styles.loading}>
                    <Loading />
                    </View>
                )
            }
        </SafeAreaView>
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
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})