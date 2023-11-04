import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import WebView from 'react-native-webview';
import { ref, onValue, set } from 'firebase/database';
import { FIREBASE_DB } from '../firebaseConfig';

export default function Video() {
  const webViewRef = useRef(null);
  const [videoTime, setVideoTime] = useState(0);
  const [link, setLink] = useState('');
  const [videoId, setVideoId] = useState('');
  const [playing, setPlaying] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [adminId, setAdminId] = useState('');
 const [viewer, setViewer] = useState('');
  const videoIdRef = ref(FIREBASE_DB, `rooms/${roomId}/videoId`);
  const playStatusRef = ref(FIREBASE_DB, `rooms/${roomId}/playStatus`);
  const videoTimeRef = ref(FIREBASE_DB, `rooms/${roomId}/videoTime`);
  const adminIdRef = ref(FIREBASE_DB, `rooms/${roomId}/adminId`);
  
  const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const createRoom = () => {
    setRoomId(generateUniqueID());
    setUserId(generateUniqueID());
    set(adminIdRef, userId);
    setAdminId(userId);
  };

  const joinRoom = (id) => {
    
    setRoomId(id);
    const newUserId = generateUniqueID();
    const viewerIdRef = ref(FIREBASE_DB, `rooms/${roomId}/viewerId`);
    set(viewerIdRef, newUserId);
    setUserId(newUserId);
  };
  useEffect(() => {
    const unsubscribeVideoId = onValue(videoIdRef, (snapshot) => {
      const newVideoId = snapshot.val();
      if (newVideoId !== null && newVideoId !== videoId) {
        webViewRef.current.injectJavaScript(`player.loadVideoById('${newVideoId}');`);
        setVideoId(newVideoId);
      }
    });
  
    const unsubscribeVideoTime = onValue(videoTimeRef, (snapshot) => {
      const newVideoTime = snapshot.val();
      if (!isNaN(newVideoTime) && Math.abs(newVideoTime - videoTime) > 1) {
        webViewRef.current.injectJavaScript(`player.seekTo(${newVideoTime}, true);`);
        setVideoTime(newVideoTime);
      }
    });
  
    const unsubscribePlayStatus = onValue(playStatusRef, (snapshot) => {
      const newPlayStatus = snapshot.val();
      if (newPlayStatus !== null && newPlayStatus !== playing) {
        if (newPlayStatus) {
          webViewRef.current.injectJavaScript('player.playVideo();');
        } else {
          webViewRef.current.injectJavaScript('player.pauseVideo();');
        }
        setPlaying(newPlayStatus);
      }
    });
  
    return () => {
      unsubscribeVideoId();
      unsubscribeVideoTime();
      unsubscribePlayStatus();
    };
  }, [roomId]);
  
  const onMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === 'videoIdChanged') {
      const currentVideoId = webViewRef.current.injectJavaScript('player.getVideoData().video_id;');
      if (currentVideoId) {
        setVideoId(currentVideoId);
        set(videoIdRef, currentVideoId);
      }
    } else if (message === 'playing') {
      setPlaying(true);
      set(playStatusRef, true);
    } else if (message === 'paused') {
      setPlaying(false);
      set(playStatusRef, false);
    } else {
      
      const time = parseFloat(message);
      if (!isNaN(time)) {
        setVideoTime(time);
        set(videoTimeRef, time);
      }
    }
  };

  const toggleVideoPlayPause = () => {
    const adminIdRef = ref(FIREBASE_DB, `rooms/${roomId}/adminId`);
    onValue(adminIdRef, (snapshot) => {
      const adminId = snapshot.val();
      if (userId !== adminId) {
        alert('Only the admin can change the video.');
        return;
      }
    else{
    setPlaying(prevPlaying => {
      const newPlaying = !prevPlaying;
      if (newPlaying) {
        webViewRef.current.injectJavaScript('player.playVideo();');
      } else {
        webViewRef.current.injectJavaScript('player.pauseVideo();');
      }
      set(playStatusRef, newPlaying);
      return newPlaying;
    })}})
  };

  const handlePress = () => {
    if (!roomId) {
      alert('Please create or join a room first.');
      return;
    }
    const adminIdRef = ref(FIREBASE_DB, `rooms/${roomId}/adminId`);
    onValue(adminIdRef, (snapshot) => {
      const adminId = snapshot.val();
      if (userId !== adminId) {
        alert('Only the admin can change the video.');
        return;
      }
      const id = link.split('v=')[1];
      if (id) {
        setVideoId(id);
        set(videoIdRef, id);
      }
    });
  };
  
  
  return (
    <View style={{marginTop:50, flex:1, marginRight:3, maxHeight:500}}>
      <WebView 
        ref={webViewRef}
        onMessage={onMessage}
        source={{html:`
          <!DOCTYPE html>
          <html>
          <head>
          <style>
            body {
              font-size: 70px;
            }
          </style>
        </head>
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
                      'playsinline': 1,
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
                  var currentVideoId = player.getVideoData().video_id;
                  if (currentVideoId !== '${videoId}') {
                    window.ReactNativeWebView.postMessage('videoIdChanged');
                    return;
                  }
                  if (state === YT.PlayerState.PLAYING) {
                    window.ReactNativeWebView.postMessage('playing');
                    window.ReactNativeWebView.postMessage(player.getCurrentTime().toString());
                  } else if (state === YT.PlayerState.PAUSED) {
                    window.ReactNativeWebView.postMessage('paused');
                    window.ReactNativeWebView.postMessage(player.getCurrentTime().toString());
                  }
                }
                
                
              </script>
            </body>
          </html>
        `}}
      />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setLink(text)}
        value={link}
      />
      <Button title="Submit" onPress={handlePress} />
      <Button title={playing ? "Pause" : "Play"} onPress={toggleVideoPlayPause} />
      <Text>Video Time: {videoTime}</Text>
      <Button title="Create Room" onPress={createRoom} />
      <Button title="Join Room" onPress={() => joinRoom(roomId)} />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={roomId}
        placeholder="Enter room ID"
      />
    </View>
  );
}