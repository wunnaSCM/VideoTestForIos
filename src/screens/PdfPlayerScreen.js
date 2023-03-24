import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Pdf from 'react-native-pdf';


const PdfPlayerScreen = ({ route }) => {

    const { pdf } = route.params;
    const source = { uri: pdf.downloadUrl, cache: true };
    const pdfUrl = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';

    return (
        <View style={styles.container}>
         
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