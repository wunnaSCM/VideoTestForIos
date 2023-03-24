import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PdfFileScreen from '../screens/PdfFileScreen';
import CsvFileScreen from '../screens/CsvFileScreen';
import AudioFileScreen from '../screens/AudioFileScreen';


const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {

    return (
        <Tab.Navigator initialRouteName='Video'>
            <Tab.Screen
                name='Video'
                component={HomeScreen}
                options={{
                    tabBarIcon: () => (
                        <Image source={require('../../assets/TabBarImage/video-player.png')} style={styles.icon} />
                    ),
                    headerShown: false
                }}

            />
            <Tab.Screen
                name='Pdf'
                component={PdfFileScreen}
                options={{
                    tabBarIcon: () => (
                        <Image source={require('../../assets/TabBarImage/pdf.png')} style={styles.icon} />
                    ),
                    headerShown: false
                }}
            />

            
            <Tab.Screen
                name='Csv'
                component={CsvFileScreen}
                options={{
                    tabBarIcon: () => (
                        <Image source={require('../../assets/TabBarImage/csv.png')} style={styles.icon} />
                    ),
                    headerShown: false
                }}
            />

            <Tab.Screen
                name='Audio'
                component={AudioFileScreen}
                options={{
                    tabBarIcon: () => (
                        <Image source={require('../../assets/TabBarImage/playlist.png')} style={styles.icon} />
                    ),
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    )
}


const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    }
});