import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
const { width, height } = Dimensions.get("screen");
import Ionicons from "@expo/vector-icons/Ionicons";
import CleanName from "../sdk/CleanName";

const MusicListItem = ({
  track,
  index,
  addHeart,
  playthisSong,
  currentTrackId,
}) => {
  const [IsPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (currentTrackId == track.id) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentTrackId]);

  const styles = StyleSheet.create({
    container: {
      width: width - 10,
      marginLeft: 5,
      borderWidth: 1,
      borderColor: "#444444",
      borderRadius: 5,
      padding: 15,
      flex: 1,
      flexDirection: "row",
      marginBottom: 20,
      backgroundColor: IsPlaying ? "#f8c100" : null,
    },
    titleSection: {
      flex: 7,
      paddingLeft: 10,
    },
    title: {
      color: "#ffffff",
      fontSize: 20,
    },
    duration: {
      fontSize: 10,
      color: "#999999",
    },
    heart: {
      marginLeft: "auto",
    },
  });

  const heartPressed = (index) => {
    addHeart(index);
  };

  // Set up the title for viewing
  const titlename = (t) => {
    let tt = "";

    if (t.length >= 30) {
      tt = t.replace(".mp3", "").substring(0, 30) + "...";
    } else {
      tt = t.replace(".mp3", "");
    }

    return tt;
  };

  // convert the time / duration to proper time mm:ss
  const timeset = (d) => {
    let minutes = Math.floor(d / 60);
    let seconds = d - minutes * 60;
    let proSec = parseInt(seconds);

    if (proSec < 10) {
      return `${minutes}:0${parseInt(seconds)}`;
    } else {
      return `${minutes}:${parseInt(seconds)}`;
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => playthisSong(track, index)}
    >
      {IsPlaying ? (
        <Ionicons name="pause-circle-outline" size={26} color="#444444" />
      ) : (
        <Ionicons name="play-circle-outline" size={26} color="#f8c100" />
      )}

      <View style={styles.titleSection}>
        <Text style={styles.title}>{CleanName(track.filename)}</Text>
        <Text style={styles.duration}>{timeset(track.duration)}</Text>
      </View>
      {track.heart ? (
        <Ionicons
          name="heart"
          size={26}
          color={IsPlaying ? "#444444" : "#f8c100"}
          style={styles.heart}
          onPress={() => heartPressed(index)}
        />
      ) : (
        <Ionicons
          name="heart-outline"
          size={26}
          color={IsPlaying ? "#444444" : "#f8c100"}
          style={styles.heart}
          onPress={() => heartPressed(index)}
        />
      )}
    </Pressable>
  );
};

export default MusicListItem;
