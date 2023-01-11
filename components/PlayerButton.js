import React, { Component } from "react";
import { Pressable, Text, StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");
import Ionicons from "@expo/vector-icons/Ionicons";

const PlayerButton = ({ track, icon, onPress, backgroundColor, color }) => {
  const styles = StyleSheet.create({
    container: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: backgroundColor ? backgroundColor : "#f8c100",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
    },
  });

  return (
    <>
      <Pressable style={styles.container} onPress={onPress}>
        <Ionicons name={icon} size={40} color={color ? color : "#000000"} />
      </Pressable>
    </>
  );
};

export default PlayerButton;
