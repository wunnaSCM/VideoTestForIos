import React from 'react';
import { NativeModules, Button, StyleSheet, View, Text } from 'react-native';



const TestNativeModulesIos = () => {

    const {Counter} = NativeModules

    const test = async () => {
        try {
            const key = "S-C-M-MobileTeam"
            const response = await Counter.increment("bob", "press")
            console.log('response', response)
        } catch (e) {
            console.error('error', e)
        }
    }
      
    return (
        <View styles={styles.container}>

            <Text>Hello</Text>
            <Text>Hello</Text><Text>Hello</Text><Text>Hello</Text><Text>Hello</Text><Text>Hello</Text><Text>Hello</Text><Text>Hello</Text>

            <Button
                title="Click to invoke your native module!"
                color="#841584"
                onPress={test}
            />
        </View>
    );
};

export default TestNativeModulesIos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 500
    },
});