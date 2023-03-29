import React, { Component, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

export default function TestApi() {

    const [listData, setListData] = useState([])


    const fetchData = async () => {
        const resp = await fetch("http://172.20.10.70:8080/api/csv");
        const data = await resp.json();
        console.log('result', data)
        setListData(data.data);
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <View style={{flex: 1}}>
            <Text> TestApi </Text>
            <FlatList
                data={listData}
                renderItem={({ item }) => {
                    return(<View style={{ backgroundColor: 'red', margin:5, padding:10 }}>
                        <Text>{item.id}</Text>
                        <Text>{item.title}</Text>
                    </View>
                    )
                }}
                keyExtractor={item => item.id}
            />
        </View>
    );

}
