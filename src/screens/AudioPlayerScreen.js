import React, { Component, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, NativeModules, SafeAreaView, Platform } from 'react-native';
import Video from 'react-native-video';
import { NavigationContainer } from '@react-navigation/native';
import AlbumArt from '../../components/audio/AlbumArt';
import Header from '../../components/audio/Header';
import Controls from '../../components/audio/Controls';
import SeekBar from '../../components/audio/SeekBar';
import TrackDetails from '../../components/audio/TrackDetails';
import Loading from '../../components/Loading';

export default class AudioPlayerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paused: false,
            totalLength: 1,
            currentPosition: 0,
            selectedTrack: 0,
            repeatOn: false,
            shuffleOn: false,
            isDecrypted: false
            // route: this.props,
            // audio: route.params
        };
    }

    componentDidMount() {
        this.decrypt();
        console.log('decrypting audio')
    }


    decrypt = async (prop) => {
        const encryptionKey = "S-C-M-MobileTeam"
        const sourceFile = prop.downloadFileUri;
        const desFile = prop.decryptedFilePath;
        const { Counter } = NativeModules;
        const { FileEncryptionModule } = NativeModules

        try {
            if (Platform.OS == 'android') {
                const proms = await FileEncryptionModule.decryptFile(sourceFile, desFile, encryptionKey)
            } else if (Platform.OS == 'ios') {
                const proms = await Counter.increment(sourceFile, desFile, encryptionKey)
            }
            this.setState({
                isDecrypted: true
            })
            console.log("finish decrypt javascript")
        } catch (e) {
            console.error(e);
        }
    }

    setDuration(data) {
        this.setState({ totalLength: Math.floor(data.duration) });
    }

    setTime(data) {
        this.setState({ currentPosition: Math.floor(data.currentTime) });
    }

    seek(time) {
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
            currentPosition: time,
            paused: false,
        });
    }

    onBack() {
        const backRes = this.state.currentPosition - 15
        this.refs.audioElement.seek(backRes);
    }

    onForward() {
        const forwardRes = this.state.currentPosition + 15
        this.refs.audioElement.seek(forwardRes);
    }

    render() {
        const { route } = this.props
        const { audio } = route.params
        const { navigation } = this.props;

        const customAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"

        this.decrypt(audio)

        const track = audio.decryptedFilePath[this.state.selectedTrack];
        const video = this.state.isChanging ? null : (
            <Video
                source={{ uri: audio.decryptedFilePath }}
                ref="audioElement"
                paused={this.state.paused}
                resizeMode="cover"
                repeat={true}
                onLoadStart={this.loadStart}
                onLoad={this.setDuration.bind(this)}
                onProgress={this.setTime.bind(this)}
                onEnd={this.onEnd}
                onError={this.videoError}
                style={styles.audioElement}
            />
        );

        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <StatusBar hidden={true} />
                    <Header message="Playing From Charts" onDownPress={() => navigation.goBack()} />
                    <AlbumArt url={audio.thumbnail} />
                    <TrackDetails title={audio.title} />
                    <SeekBar
                        onSeek={this.seek.bind(this)}
                        trackLength={this.state.totalLength}
                        onSlidingStart={() => this.setState({ paused: true })}
                        currentPosition={this.state.currentPosition}
                    />
                    <Controls
                        onPressRepeat={() => this.setState({ repeatOn: !this.state.repeatOn })}
                        repeatOn={this.state.repeatOn}
                        shuffleOn={this.state.shuffleOn}
                        forwardDisabled={this.state.selectedTrack === audio.decryptedFilePath.length - 1}
                        onPressShuffle={() => this.setState({ shuffleOn: !this.state.shuffleOn })}
                        onPressPlay={() => this.setState({ paused: false })}
                        onPressPause={() => this.setState({ paused: true })}
                        onBack={this.onBack.bind(this)}
                        onForward={this.onForward.bind(this)}
                        paused={this.state.paused}
                    />
                    {video}
                </View>
            </SafeAreaView>
        );
    }
}


// export default function AudioPlayerScreen({ route }) {

//     const { audio } = route.params;

//     const [paused, setPaused] = useState(true)
//     const [totalLength, setTotalLength] = useState(1)
//     const [currentPosition, setCurrentPosition] = useState(0)
//     const [selectedTrack, setSelectedTrack] = useState(0)
//     const [repeatOn, setRepeatOn] = useState(false)
//     const [shuffleOn, setShuffleOn] = useState(false)
//     const [isChanging, setIsChanging] = useState(false)

//     const audioRef = useRef(audio.decryptedFilePath)

//     useEffect(() => {
//         decrypt()
//         console.log('audio path', audio.decryptedFilePath)   
//     }, [])


//     const decrypt = async () => {

//         const encryptionKey = "S-C-M-MobileTeam"
//         const sourceFile = audio.downloadFileUri;
//         const desFile = audio.decryptedFilePath;
//         try {
//             const proms = await FileEncryptionModule.decryptFile(sourceFile, desFile, encryptionKey)
//             console.log(`${proms}`);
//         } catch (e) {
//             console.error(e);
//         }
//     }

//     const handleLength = (data) => {
//         setTotalLength(Math.floor(data.duration))
//     }

//     const handleTime = (data) => {
//         setCurrentPosition(Math.floor(data.currentTime))
//     }

//     const handleSeek = (time) => {
//         //         this.refs.audioElement && this.refs.audioElement.seek(time);
//         //         this.setState({
//         //             currentPosition: time,
//         //             paused: false,
//         //         });
//         time = Math.round(time);
//         // audioRef.current && audioRef.current.handleSeek(time)
//         audio.decryptedFilePath.onSeek(time)
//         setCurrentPosition(time)
//         setPaused(false)
//     }

//     const handlePaused = () => {
//         setPaused(false)
//     }

//     const onBack = () => {
//         if (currentPosition < 10 && selectedTrack > 0) {
//             setIsChanging(true)
//             setTimeout(() => {
//                 setCurrentPosition(0)
//                 setPaused(false)
//                 setTotalLength(1)
//                 setIsChanging(false)
//                 setSelectedTrack(selectedTrack - 1)
//             }, 0)
//         } else {
//             setCurrentPosition(0)
//         }
//     }

//     const onForward = () => {
//         if (selectedTrack < audioArr.length - 1) {
//             setIsChanging(true)
//             setTimeout(() => {
//                 setCurrentPosition(0)
//                 setPaused(false)
//                 setTotalLength(1)
//                 setIsChanging(false)
//                 setSelectedTrack(selectedTrack + 1)
//             }, 0)
//         }
//     }

//     const video = isChanging ? null : (
//         <Video
//             source={{ uri: audio.decryptedFilePath }}
//             // useRef="audioElement"
//             ref={audioRef}
//             paused={paused}
//             resizeMode="cover"
//             repeat={true}
//             // onLoadStart={loadStart} 
//             onLoad={handleLength}
//             onProgress={handleTime}
//             // onEnd={onEnd}        
//             // onError={videoError}    
//             style={styles.audioElement}
//         />
//     )



//     // handleChange = e => this.setState({currentItem: e.target.value})
//     // const handleChange = e => setCurrentItem(e.target.value)


//     return (
//         <View style={styles.container}>
//             <StatusBar hidden={true} />
//             <Header message="Playing From Charts" />
//             <AlbumArt />
//             <TrackDetails title={audio.title} />
//             <SeekBar
//                 onSeek={handleSeek}
//                 trackLength={totalLength}
//                 onSlidingStart={handlePaused}
//                 currentPosition={currentPosition}
//             />
//             <Controls
//                 onPressRepeat={() => setRepeatOn(!repeatOn)}
//                 repeatOn={repeatOn}
//                 shuffleOn={shuffleOn}
//                 forwardDisabled={selectedTrack === audio.decryptedFilePath.length - 1}
//                 onPressShuffle={() => setShuffleOn(!shuffleOn)}
//                 onPressPlay={() => {
//                     setPaused(false);
//                     // audioRef.current.setPaused(false);
//                     }}
//                 onPressPause={() => {
//                     setPaused(true);
//                     // audioRef.current.setPaused(true);
//                     }}
//                 onBack={onBack}
//                 onForward={onForward}
//                 paused={paused}
//             />
//             {video}


//         </View>
//     )
// }




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(4,4,4)',
    },
    audioElement: {
        height: 0,
        width: 0,
    }
});
