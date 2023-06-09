import React, { Component, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Video from 'react-native-video';
import { NavigationContainer } from '@react-navigation/native';
import AlbumArt from '../../components/audio/AlbumArt';
import Header from '../../components/audio/Header';
import Controls from '../../components/audio/Controls';
import SeekBar from '../../components/audio/SeekBar';
import TrackDetails from '../../components/audio/TrackDetails';

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
        };
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
        
        console.log('title update', audio.downloadUrl)  

        const track = audio.downloadUrl[this.state.selectedTrack];
        const video = this.state.isChanging ? null : (
            <Video
                source={{ uri: audio.downloadUrl }}
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
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <Header message="Playing From Charts" onDownPress={() => navigation.goBack()}/>
                <AlbumArt url={audio.artwork}/>
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
                    forwardDisabled={this.state.selectedTrack === audio.downloadUrl.length - 1}
                    onPressShuffle={() => this.setState({ shuffleOn: !this.state.shuffleOn })}
                    onPressPlay={() => this.setState({ paused: false })}
                    onPressPause={() => this.setState({ paused: true })}
                    onBack={this.onBack.bind(this)}
                    onForward={this.onForward.bind(this)}
                    paused={this.state.paused}
                />
                {video}

               
            </View>
        );
    }
}




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
