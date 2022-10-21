import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");

const ProgressBar = ({ track }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.circle}></View>
      <View style={styles.innerbar}></View>
    </View>
  );
};

export default ProgressBar;
