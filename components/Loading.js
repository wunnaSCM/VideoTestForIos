import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'


const Loading = () => {
    return (
        <View>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
})