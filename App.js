import React from "react";
import { View, Text } from "react-native";
import StackNavigator from "./src/navigation/StackNavigator";
import TestApi from "./src/screens/TestApi";




export default function App() {

    return (
        <>
            <StackNavigator />     
            {/* <TestApi /> */}
        </>
    );
}
