import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import Ionicons from "@expo/vector-icons/Ionicons";

const PlayList = ({ closeList }) => {
  const styles = StyleSheet.create({
    container: {
      width: width,
      height: height,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 2,
    },
    inner: {
      width: width - 20,
      marginLeft: 10,
      marginRight: 20,
      marginTop: 50,
      paddingTop: 30,
      borderRadius: 10,
      backgroundColor: "#f8c100",
    },
    close: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#000000",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      position: "absolute",
      right: 10,
      top: 25,
      zIndex: 2,
    },
    plistcon: {
      flexDirection: "row",
      width: width - 20,
      margin: 10,
      borderBottomWidth: 1,
      borderColor: "#111111",
      padding: 10,
    },
    title: {
      fontSize: 20,
      color: "#111111",
      marginLeft: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.close} onPress={() => closeList()}>
        <Ionicons name="close-outline" size={50} color="#ffffff" />
      </Pressable>
      <ScrollView style={styles.inner}>
        <View style={styles.plistcon}>
          <Ionicons name="list-outline" size={20} color="#000000" />
          <Text style={styles.title}>Title of playlist</Text>
        </View>
        <View style={styles.plistcon}>
          <Ionicons name="list-outline" size={20} color="#000000" />
          <Text style={styles.title}>Title of playlist</Text>
        </View>
        <View style={styles.plistcon}>
          <Ionicons name="list-outline" size={20} color="#000000" />
          <Text style={styles.title}>Title of playlist</Text>
        </View>
        <View style={styles.plistcon}>
          <Ionicons name="list-outline" size={20} color="#000000" />
          <Text style={styles.title}>Title of playlist</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PlayList;
