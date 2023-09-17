import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";

const Profile = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [fullName, setFullName] = useState("Nome Completo");
  const [email, setEmail] = useState("email@example.com");

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      console.log("Photo taken:", uri);
      setPhoto(uri);
      setCameraVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Perfil</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => setCameraVisible(true)}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.profileImage} />
          ) : (
            <View style={styles.iconContainer}>
              <Text>
                <Feather name="camera" size={40} color="#fff" />{" "}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.fullName}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={cameraVisible}
        onRequestClose={() => setCameraVisible(false)}
      >
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ratio="16:9"
        >
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => handleCapture()}
          >
            <View style={styles.captureButtonInner}>
              <View style={styles.captureButtonCircle}>
                <View style={styles.captureButtonCenter} />
              </View>
            </View>
          </TouchableOpacity>
        </Camera>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 100,
    backgroundColor: "#7289DA",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  userInfoContainer: {
    alignItems: "center",
    backgroundColor: "#7289DA",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1e4e8",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 70,
    backgroundColor: "#1F1F23",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 50,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },

  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  captureButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonCenter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "gray",
  },
});

export default Profile;
