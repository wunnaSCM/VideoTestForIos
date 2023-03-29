import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import csv from 'csvtojson';
import { DataTable } from 'react-native-paper';
var RNFS = require('react-native-fs');

export default function DisplayCsvDataTable(props) {

    const [page, setPage] = React.useState(0);
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = React.useState(10);
    const [fileData, setFileData] = useState()

    const [state, setState] = React.useState({
        tableHead: [],
        tableData: [
            []
        ],
        currentPageData: [
            []
        ],
        numberOfPages: 1
    });

    useEffect(() => {
        setTableData(props.csvFileUrl);
        setNumberOfItemsPerPage(props.numItemsPerPage);
    }, []);

    useEffect(() => {
        setCurrentPageData();
    }, [page]);

    useEffect(() => {
        setCurrentPageData();
    }, [state.tableData]);

    const setCurrentPageData = () => {
        const startIndex = page * numberOfItemsPerPage;
        let endIndex = startIndex + numberOfItemsPerPage;
        if (endIndex > state.tableData.length) {
            endIndex = state.tableData.length - 1;
        }
        if (state.tableData.length > 1) {
            setState({
                ...state,
                currentPageData: state.tableData.slice(startIndex, endIndex)
            });
        }
    }

    function setTableData(csvFileUrl) {
       RNFS.readFile(csvFileUrl, 'ascii')
            .then(async (response) => {
                // console.log('response', response);
                csv({
                    noheader: true,
                    output: "csv"
                }).fromString(response)
                    .then((csvRow) => {
                        let pages = (csvRow.length / numberOfItemsPerPage);
                        if (csvRow.length > numberOfItemsPerPage * pages) {
                            pages = pages + 1;
                        }
                        setState({
                            ...state,
                            tableHead: csvRow[0],
                            tableData: csvRow.slice(1),
                            numberOfPages: pages
                        });
                    })
            })
            .catch((error) => {
                console.error("some error occurred", error);
            });
    }

    return (
        <View style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    {
                        state.tableHead.map((rowData, index) => (
                            <DataTable.Title key={index}>{rowData}</DataTable.Title>
                        ))
                    }
                </DataTable.Header>

                {
                    state.currentPageData.map((rowData, index) => (
                        <DataTable.Row key={index}>
                            {
                                rowData.map((cellData, cellIndex) => (
                                    <DataTable.Cell key={cellIndex}>{cellData}</DataTable.Cell>
                                ))
                            }
                        </DataTable.Row>
                    ))
                }

                <DataTable.Pagination
                    page={page}
                    numberOfPages={state.numberOfPages}
                    onPageChange={(page) => setPage(page)}
                    label={`Page ${page + 1} of ${state.numberOfPages}`}
                    showFastPagination
                    optionsLabel={'Rows per page'}
                />
            </DataTable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 4, 
        paddingTop: 4, 
        backgroundColor: '#fff' 
    },
    head: {
        height: 40, 
        backgroundColor: '#f1f8ff', 
        color: '#fff'
    },
    text: { 
        margin: 6 
    },
});
