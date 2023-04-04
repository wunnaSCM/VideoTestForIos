import React from "react";
import StackNavigator from "./src/navigation/StackNavigator";
import Toast from 'react-native-toast-message';
import { toastMessage } from "./src/utils/toastMessage";


export default function App() {

    return (
        <>
            <StackNavigator />
            <Toast config={toastMessage} />
        </>
    );
}
