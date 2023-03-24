import React from "react";
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import DisplayCsvDataTable from "../../components/DisplayCsvDataTable";

export default function CsvPlayerScreen({route}) {

    const { csv } = route.params;
    console.log('csvLink', csv.downloadUrl, csv.url)
    const url = csv.downloadUrl

    return (
        <View style={styles.container}>
            <ScrollView>
                <DisplayCsvDataTable numItemsPerPage={10} csvFileUrl={csv.downloadUrl}/>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})