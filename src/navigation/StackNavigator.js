import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AudioPlayerScreen from '../screens/AudioPlayerScreen';
import CsvPlayerScreen from '../screens/CsvPlayerScreen';
import PdfPlayerScreen from '../screens/PdfPlayerScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }}  />
                <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PdfPlayer" component={PdfPlayerScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CsvPlayer" component={CsvPlayerScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
