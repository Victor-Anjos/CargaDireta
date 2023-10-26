import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const Info = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Informativos simbólicos</Text>
      </View>

      <View style={styles.infoItem}>
        <Text style={styles.infoText}>
          <Feather name="alert-triangle" style={styles.infoIcon} /> - Descida
          perigosa
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoText}>
          <Feather name="search" style={styles.infoIcon} /> - Ponto interessante
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoText}>
          <Feather name="droplet" style={styles.infoIcon} /> - Posto de gasolina
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoText}>
          <Feather name="compass" style={styles.infoIcon} /> - Ponto de descanso
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoText}>
          <Feather name="alert-octagon" style={styles.infoIcon} /> - Via
          obstruída
        </Text>
      </View>
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
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoIcon: {
    fontSize: 22,
    marginRight: 8,
    color: "#7289DA", // Cor dos ícones
  },
  infoText: {
    fontSize: 22,
  },
  backButton: {
    backgroundColor: "#7289DA",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Info;
