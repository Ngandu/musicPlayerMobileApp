import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getMediaFiles() {
  // get the Audio files in the phone
  async function getAudioFile() {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });

    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });

    return media.assets;
  }

  // Get Permission
  let permision = await MediaLibrary.getPermissionsAsync();

  if (permision.granted) {
    // Get media files
    return await getAudioFile();
  }

  if (!permision.granted && permision.canAskAgain) {
    // Ask again for permission
    const { status, canAskAgain, granted } =
      await MediaLibrary.requestPermissionsAsync();

    if (status === "denied" && canAskAgain) {
      // Alert user to allow
      await MediaLibrary.requestPermissionsAsync();
    }

    if (status === "denied" && !canAskAgain) {
      // Alert an error to user for not allowing
      alert(
        "You cannot use the app with alloing us to load audio from your device"
      );
    }

    if (granted) {
      // get the Audio files
    }
  }

  console.log(permision);
}

export async function storeData(type, data, name) {
  if (type == "post") {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(name, jsonValue);
      return true;
    } catch (e) {
      // saving error
      console.warn(e);
      return false;
    }
  }

  if (type == "get") {
    try {
      const jsonValue = await AsyncStorage.getItem(name);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.warn(e);
      return false;
    }
  }
}
