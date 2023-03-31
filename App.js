import React from "react";
import { View, Text } from "react-native";
import StackNavigator from "./src/navigation/StackNavigator";
import TestNativeModulesIos from "./src/screens/TestNativeModuleIos";






export default function App() {

    return (
        <>
            <StackNavigator />     
           {/* <TestNativeModulesIos /> */}
        </>
    );
}
