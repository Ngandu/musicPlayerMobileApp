import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  View,
  Text,
  Pressable,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import getMediaFiles from "../sdk";
import CleanName from "../sdk/CleanName";

import MusicListItem from "../components/musicListItem";
import ProgressBar from "../components/ProgressBar";
import PlayerButton from "../components/PlayerButton";
import PlayList from "../components/PlayList";

const Home = () => {
  const [Songs, setSongs] = useState([]);
  const [Sound, setSound] = useState();
  const [currentTrackId, setCurrentTrackId] = useState();
  const [currentTrackTitle, setCurrentTrackTitle] = useState("");
  const [PlayBackStatus, setPlayBackStatus] = useState(null);
  const [play, setPlay] = useState(false);
  const [openlist, setOpenlist] = useState(false);
  const [fakeData, setFakeData] = useState([
    { title: "Together to the end" },
    { title: "Missing the good old days" },
    { title: "Big man fight vol.2" },
    { title: "Together to the end" },
    { title: "Missing the good old days" },
    { title: "Big man fight vol.2" },
  ]);

  const sound = React.useRef(new Audio.Sound());

  async function playSound(audio) {
    if (Sound === null) {
      const { sound } = await Audio.Sound.createAsync({ uri: audio.uri });
      setSound(sound);

      console.log("Playing Sound nothing else in here");
      await sound.playAsync();
      setCurrentTrackId(audio.id);
      setCurrentTrackTitle(audio.filename);
      setPlay(true);
    } else {
      console.log("There is a song currently playing");
      // Check whether it's the same track as that which is playing
      console.log("currentTrackId: ", currentTrackId);
      if (audio.id == currentTrackId) {
        console.log("Its the same song - So unload");
        Sound.unloadAsync();
        setCurrentTrackId(0);
        setPlay(false);
      } else {
        console.log("Its a different song - reload and play");
        /// not the same track
        // 1. Unload
        if (Sound) Sound.unloadAsync();
        setCurrentTrackId(0);

        // 2 add new track
        const { sound } = await Audio.Sound.createAsync({ uri: audio.uri });
        setSound(sound);

        console.log("Playing Sound");
        await sound.playAsync();
        setCurrentTrackId(audio.id);
        setCurrentTrackTitle(audio.filename);
        setPlay(true);
      }
    }
  }

  // Controllers
  const playButtonPressed = async () => {
    // Check if there is a song loaded
    if (play) {
      Sound.pauseAsync();
      setPlay(false);
    } else {
      await Sound.playAsync();
      setPlay(true);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#181818",
    },
    topImage: {
      width: width,
      height: height / 3,
    },
    details: {
      borderLeftColor: "#f8c100",
      borderLeftWidth: 5,
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
    },
    title: {
      fontSize: 20,
      color: "#ffffff",
      fontWeight: "800",
    },
    timer: {
      color: "#ffffff",
    },
    controller: {
      marginTop: 20,
    },
    players: {
      flexDirection: "row",
      marginTop: 10,
      marginBottom: 10,
      justifyContent: "center",
    },
    nav: {
      flexDirection: "row",
      backgroundColor: "#f8c100",
      justifyContent: "space-between",
    },
    navBtn: {
      padding: 20,
    },
  });

  const loadAidio = async () => {
    try {
      let songs = await getMediaFiles();
      setSongs(songs);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    loadAidio();
  }, []);

  const closeList = () => {
    setOpenlist(!openlist);
  };

  const addHeart = (i) => {
    let temp = [...fakeData];
    temp[i].heart = true;
    setFakeData(temp);
  };

  return (
    <View style={styles.container}>
      {openlist && <PlayList closeList={closeList} />}

      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/originals/14/be/a9/14bea97986a9a3af9ef4b65842162303.jpg",
        }}
        style={styles.topImage}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={styles.title}>
          {currentTrackTitle.length > 3
            ? CleanName(currentTrackTitle, true)
            : "No Song"}
        </Text>
        <Text style={styles.timer}>04:34</Text>
      </View>
      <ScrollView>
        {Songs.length > 0 &&
          Songs.map((track, i) => {
            return (
              <MusicListItem
                track={track}
                key={track.id}
                index={i}
                addHeart={addHeart}
                playthisSong={playSound}
              />
            );
          })}
      </ScrollView>
      <View style={styles.controller}>
        <ProgressBar />
        <View style={styles.players}>
          <PlayerButton icon={"play-skip-back-outline"} />
          <PlayerButton
            icon={play ? "pause-outline" : "play-outline"}
            onPress={() => playButtonPressed()}
          />
          <PlayerButton icon={"play-skip-forward-outline"} />
        </View>
      </View>
      <View style={styles.nav}>
        <Pressable style={styles.navBtn}>
          <Ionicons name="home-outline" size={40} color="#000000" />
        </Pressable>
        <Pressable style={styles.navBtn} onPress={() => closeList()}>
          <Ionicons name="list-outline" size={40} color="#000000" />
        </Pressable>
        <Pressable style={styles.navBtn}>
          <Ionicons name="heart-outline" size={40} color="#000000" />
        </Pressable>
      </View>
    </View>
  );
};

export default Home;
