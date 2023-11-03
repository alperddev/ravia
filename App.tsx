import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import WebView from 'react-native-webview';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { FIREBASE_APP } from './firebaseConfig';

export default function App() {
  const webViewRef = useRef(null);
  const [videoTime, setVideoTime] = useState(0);
  const [link, setLink] = useState('');
  const [videoId, setVideoId] = useState('');
  const [playing, setPlaying] = useState(false);
  const db = getDatabase(FIREBASE_APP);
  const videoIdRef = ref(db, 'videoId');
  const playStatusRef = ref(db, 'playStatus');
  const videoTimeRef = ref(db, 'videoTime');

  useEffect(() => {
    const unsubscribeTime = onValue(videoTimeRef, (snapshot) => {
      const newTime = snapshot.val();
      if (newTime !== null) {
        webViewRef.current.injectJavaScript(`player.seekTo(${newTime}, true);`);
      }
    });

    const unsubscribePlayStatus = onValue(playStatusRef, (snapshot) => {
      const newPlayStatus = snapshot.val();
      if (newPlayStatus !== null) {
        if (newPlayStatus) {
          webViewRef.current.injectJavaScript('player.playVideo();');
        } else {
          webViewRef.current.injectJavaScript('player.pauseVideo();');
        }
        setPlaying(newPlayStatus);
      }
    });

    const unsubscribeVideoId = onValue(videoIdRef, (snapshot) => {
      const newVideoId = snapshot.val();
      if (newVideoId !== null) {
        webViewRef.current.injectJavaScript(`player.loadVideoById('${newVideoId}');`);
        setVideoId(newVideoId);
      }
    });

    return () => {
      unsubscribeTime();
      unsubscribePlayStatus();
      unsubscribeVideoId();
    };
  }, []);

  const onMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === 'playing') {
      setPlaying(true);
      set(playStatusRef, true);
    } else if (message === 'paused') {
      setPlaying(false);
      set(playStatusRef, false);
    } else {
      setVideoTime(message);
      set(videoTimeRef, message);
    }
  };

  const toggleVideoPlayPause = () => {
    setPlaying(prevPlaying => {
      const newPlaying = !prevPlaying;
      if (newPlaying) {
        webViewRef.current.injectJavaScript('player.playVideo();');
      } else {
        webViewRef.current.injectJavaScript('player.pauseVideo();');
      }
      set(playStatusRef, newPlaying);
      return newPlaying;
    });
  };

  const handlePress = () => {
    const id = link.split('v=')[1];
    setVideoId(id);
    set(videoIdRef, id); // Update the video ID in Firebase
  };

  return (
    <View style={{marginTop:50, flex:1}}>
      <View style={{flex:1}}>
        <WebView 
          ref={webViewRef}
          onMessage={onMessage}
          source={{html:`
            <!DOCTYPE html>
            <html>
              <body>
                <div id="player"></div>
                <script>
                  var tag = document.createElement('script');
                  tag.src = "https://www.youtube.com/iframe_api";
                  var firstScriptTag = document.getElementsByTagName('script')[0];
                  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                  var player;
                  function onYouTubeIframeAPIReady() {
                    player = new YT.Player('player', {
                      height: '600',
                      width: window.innerWidth,
                      videoId: '${videoId}',
                      playerVars: {
                        'playsinline': 1
                      },
                      events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                      }
                    });
                  }

                  function onPlayerReady(event) {
                    event.target.playVideo();
                  }

                  function onPlayerStateChange(event) {
                    var state = event.data;
                    if (state === YT.PlayerState.PLAYING) {
                      window.ReactNativeWebView.postMessage('playing');
                    } else if (state === YT.PlayerState.PAUSED) {
                      window.ReactNativeWebView.postMessage('paused');
                    }
                    window.ReactNativeWebView.postMessage(player.getCurrentTime());
                  }
                </script>
              </body>
            </html>
          `}}
        />
      </View>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setLink(text)}
        value={link}
      />
      <Button title="Submit" onPress={handlePress} />
      <Button title={playing ? "Pause" : "Play"} onPress={toggleVideoPlayPause} />
      <Text>Video Time: {videoTime}</Text>
    </View>
  );
}
