import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableHighlight,
  TextInput,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import { getMediaFiles, storeData } from "../sdk";
import CleanName from "../sdk/CleanName";
import { TimeConvert, TimeConvertMil } from "../sdk/TimeConvert";

import MusicListItem from "../components/musicListItem";
import ProgressBar from "../components/ProgressBar";
import PlayerButton from "../components/PlayerButton";

const Home = () => {
  const [Songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [Sound, setSound] = useState();
  const [currentTrackId, setCurrentTrackId] = useState();
  const [currentTrackTime, setCurrentTrackTime] = useState(0);
  const [currentTrackTitle, setCurrentTrackTitle] = useState("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Tracks the index of current song in the list
  const [lovedSongs, setLovedSongs] = useState([]);
  const [play, setPlay] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [songPosition, setSongPosition] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [songState, setSongState] = useState("stop");

  const sound = React.useRef(new Audio.Sound());

  async function playSound(audio, i) {
    // console.log(audio);
    if (Sound === null) {
      const { sound, status } = await Audio.Sound.createAsync({
        uri: audio.uri,
      });
      setSound(sound);

      //console.log("Playing Sound nothing else in here");
      await sound.playAsync();

      //sound.setOnPlaybackStatusUpdate(() => console.log(status.positionMilis));
      setCurrentTrackId(audio.id);
      setCurrentTrackTitle(audio.filename);
      setCurrentTrackIndex(i);
      setCurrentTrackTime(audio.duration);
      setPlay(true);
      setSongState("play");
    } else {
      // console.log("There is a song currently playing");
      // Check whether it's the same track as that which is playing
      // console.log("currentTrackId: ", currentTrackId);
      if (audio.id == currentTrackId) {
        // console.log("Its the same song - So unload");
        Sound.unloadAsync();
        setCurrentTrackId(0);
        setPlay(false);
        setSongState("pause");
      } else {
        // console.log("Its a different song - reload and play");
        /// not the same track
        // 1. Unload
        if (Sound) Sound.unloadAsync();
        setCurrentTrackId(0);

        // 2 add new track
        const { sound } = await Audio.Sound.createAsync({ uri: audio.uri });
        setSound(sound);

        // console.log("Playing Sound");
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await sound.playAsync();
        setCurrentTrackId(audio.id);
        setCurrentTrackTitle(audio.filename);
        setCurrentTrackIndex(i);
        setCurrentTrackTime(audio.duration);
        setPlay(true);
        setSongState("play");
      }
    }
  }

  // Controllers
  const playButtonPressed = async () => {
    // Check if there is a song loaded
    // console.log(play);
    if (play) {
      if (songState == "play") {
        Sound.pauseAsync();
        setSongState("paused");
        return;
      } else if (songState == "paused") {
        Sound.playAsync();
        setSongState("play");
        return;
      } else {
        Sound.pauseAsync();
        setSongState("stop");
        setPlay(false);
        return;
      }
    } else {
      // await Sound.playAsync();
      await playSound(Songs[0], 0);
      setPlay(true);
      setSongState("play");
    }
  };

  // Next song play
  const nextButtonPressed = async () => {
    // console.log("currentTrackIndex: ", currentTrackIndex);
    if (currentTrackIndex >= 0 && currentTrackIndex < Songs.length - 1) {
      let nextIndex = currentTrackIndex + 1;
      // console.log("nextIndex: ", nextIndex);
      let nextSong = Songs[nextIndex];
      setCurrentTrackIndex(nextIndex);
      await playSound(nextSong, nextIndex);
    } else {
      // if a song is currently plying, this means the first song is playing
      if (play) {
        await playSound(Songs[1], 1);
        return;
      }
      // if Playing is not on then the first song on the array should play
      await playSound(Songs[0], 0);
    }
  };

  // Previous song
  const previousButtonPressed = async () => {
    // console.log("currentTrackIndex: ", currentTrackIndex);
    if (currentTrackIndex > 0) {
      let nextIndex = currentTrackIndex - 1;
      let nextSong = Songs[nextIndex];
      setCurrentTrackIndex(nextIndex);
      playSound(nextSong, nextIndex);
    } else {
      // // if a song is currently plying, this means the first song is playing
      // if (play) {
      //   playSound(Songs[0], 0);
      //   return;
      // }
      // // if Playing is not on then the first song on the array should play
      // playSound(Songs[0], 0);
      return;
    }
  };

  // Keep progress of the track
  // When track has ended @didJustFinish will be true then go to next track
  function onPlaybackStatusUpdate({
    uri,
    didJustFinish,
    positionMillis,
    durationMillis,
  }) {
    // console.log("onPlaybackStatusUpdate: ", uri, didJustFinish);
    // console.log(positionMillis, durationMillis);

    // // Normal updates don't interest us.
    if (!didJustFinish) {
      let temp = (durationMillis - positionMillis) / durationMillis;
      let temp2 = parseInt(temp * 100);

      setSongPosition(positionMillis);
      setSongProgress(100 - temp2);
      return;
    }

    // reloadSoundForKey(key);
    nextButtonPressed();
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#181818",
    },
    // topImage: {
    //   width: width,
    //   height: height / 3,
    // },
    searchContainer: {
      marginTop: 30,
      width: width,
      height: 70,
      padding: 10,
      flexDirection: "row",
    },
    searchInput: {
      borderBottomWidth: 0.5,
      borderColor: "#dddddd",
      color: "#eeeeee",
      placeholderTextColor: "#dddddd",
      flex: 0.8,
      padding: 10,
    },
    searchButton: {
      backgroundColor: "#f8c100",
      flex: 0.2,
      alignItems: "center",
      justifyContent: "center",
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
      flex: 0.5,
      padding: 20,
      alignItems: "center",
    },
    noSong: {
      color: "#ffffff",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 100,
      fontSize: 25,
    },
  });

  // Sync songs from device to application
  const syncSongs = async () => {
    try {
      let songs = await getMediaFiles();
      // Load the Loved songs and add the hearts to the songs
      // Add hearts to songs
      let dt = await storeData("get", null, "@lovedsongs");
      if (dt !== null) {
        dt.forEach((ld) => {
          songs.forEach((ss, i) => {
            if (ss.id == parseInt(ld)) {
              songs[i].heart = true;
            }
          });
        });
      }

      // Load songs
      setSongs(songs);
      setFilteredSongs(songs);
      let t = await storeData("post", songs, "@songs");
      if (t) {
        alert("Songs loaded succefully");
      } else {
        alert(t);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  // Load Songs either from device or saved data
  const loadAidio = async () => {
    // Check if there is Audio already loaded
    let data = await storeData("get", null, "@songs");

    // If there is no songs in the storage then load local songs
    if (data.length == 0) {
      await syncSongs(data);
    } else {
      // If there are songs then load them from storage
      setSongs(data);
      setFilteredSongs(data);
    }
  };

  useEffect(() => {
    StatusBar.setTranslucent(true);
    loadAidio();
  }, []);

  const filterData = async (type, search = false) => {
    if (search) {
      // filter by song title
      const newData = Songs.filter((item) => item.filename.includes(type));
      setFilteredSongs(newData);
      return;
    } else {
      if (type == "heart") {
        let temp = Songs.filter((song) => (song.heart == true ? song : null));
        setFilteredSongs(temp);
        return;
      }

      if (type == "all") {
        setFilteredSongs(Songs);
        return;
      }
    }
  };

  const addHeart = async (i) => {
    let songsTemp = [...Songs];
    songsTemp[i].heart = true;
    setFilteredSongs(songsTemp);
    let newLove = [...lovedSongs, songsTemp[i].id];
    setLovedSongs(newLove);

    // load data to storage
    let data = await storeData("post", newLove, "@lovedsongs");
    if (data) {
      console.log("saved loved songs");
    }
  };

  const searchForSong = () => {
    // filter by search
    filterData(searchText, true);
  };
  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={{
          uri: "https://i.pinimg.com/originals/14/be/a9/14bea97986a9a3af9ef4b65842162303.jpg",
        }}
        style={styles.topImage}
        resizeMode="cover"
      /> */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={"#dddddd"}
          defaultValue={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => searchForSong()}
        >
          <Ionicons name="search-outline" size={30} color="#000000" />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>
          {currentTrackTitle.length > 3
            ? CleanName(currentTrackTitle, true)
            : "No Song"}
        </Text>
        <Text style={styles.timer}>
          {currentTrackTitle.length > 3 ? TimeConvert(currentTrackTime) : ""} -{" "}
          {songPosition > 3 ? TimeConvertMil(songPosition) : ""}
        </Text>
      </View>
      <ScrollView>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((track, i) => {
            return (
              <MusicListItem
                track={track}
                key={track.id}
                index={i}
                addHeart={addHeart}
                playthisSong={playSound}
                currentTrackId={currentTrackId}
                songState={songState}
              />
            );
          })
        ) : (
          <Text style={styles.noSong}>There are no songs</Text>
        )}
      </ScrollView>
      <View style={styles.controller}>
        <ProgressBar
          duration={currentTrackTime}
          trackId={currentTrackId}
          Playing={play}
          songPosition={songProgress}
        />
        <View style={styles.players}>
          <PlayerButton
            icon={"play-skip-back-outline"}
            onPress={() => previousButtonPressed()}
          />
          <PlayerButton
            icon={songState == "play" ? "pause-outline" : "play-outline"}
            onPress={() => playButtonPressed()}
          />
          <PlayerButton
            icon={"play-skip-forward-outline"}
            onPress={() => nextButtonPressed()}
          />
        </View>
      </View>
      <View style={styles.nav}>
        {/* <Pressable style={styles.navBtn} onPress={() => closeList()}> */}
        <TouchableHighlight
          style={styles.navBtn}
          onPress={() => filterData("all")}
        >
          <Ionicons name="list-outline" size={40} color="#000000" />
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.navBtn}
          onPress={() => filterData("heart")}
        >
          <Ionicons name="heart-outline" size={40} color="#000000" />
        </TouchableHighlight>
        <TouchableHighlight style={styles.navBtn} onPress={() => syncSongs()}>
          <Ionicons name="sync-outline" size={40} color="#000000" />
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Home;
