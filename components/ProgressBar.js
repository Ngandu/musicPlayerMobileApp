import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");

const ProgressBar = ({ duration, trackId, Playing }) => {
  const [id, setId] = useState(0);
  const [timeLapsed, setTimeLapsed] = useState(0);

  const styles = StyleSheet.create({
    container: {
      width: width - 10,
      height: 7,
      backgroundColor: "#777777",
    },
    innerbar: {
      width: width / 2,
      height: 7,
      backgroundColor: "#f8c100",
    },
    circle: {
      backgroundColor: "#f8c100",
      position: "absolute",
      width: 20,
      height: 20,
      borderRadius: 10,
      zIndex: 2,
      marginLeft: width / 2,
      marginTop: -5,
    },
  });

  // Play duration counter
  const timerCount = (cmd) => {
    let countInterval;

    if (cmd == "countup") {
      var i = 0;
      // This block will be executed 100 times.
      countInterval = setInterval(function () {
        if (i == 200 || i > 200) clearInterval(this);
        // else console.log("Currently at " + i++);
      }, 1000);
    }

    if (cmd == "paused") {
      clearInterval(countInterval);
    }
  }; // End

  useEffect(() => {
    console.log("progress: ", Playing);

    if (Playing) {
      // Check if the song is the same
      console.log(id, trackId);
      if (id !== trackId) {
        console.log("playing new song");
        setId(trackId);
      } else {
        timerCount("countup");
        console.log("playing same song");
      }
    } else {
      timerCount("paused");
    }
  }, [Playing, trackId]);

  return (
    <View style={styles.container}>
      <View style={styles.circle}></View>
      <View style={styles.innerbar}></View>
    </View>
  );
};

export default ProgressBar;
