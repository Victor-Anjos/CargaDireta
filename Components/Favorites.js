import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Favorites = ({ navigation }) => {
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);

  const loadFavoriteRoutes = async () => {
    try {
      const savedRoutes = await AsyncStorage.getItem("favoriteRoutes");
      if (savedRoutes) {
        const routes = JSON.parse(savedRoutes);
        setFavoriteRoutes(routes);
      }
    } catch (error) {
      console.error("Erro ao carregar rotas favoritas:", error);
    }
  };

  const handleDeleteRoute = async (route) => {
    try {
      const updatedRoutes = favoriteRoutes.filter(
        (item) =>
          item.localAtual !== route.localAtual ||
          item.localDesejado !== route.localDesejado ||
          item.horario !== route.horario
      );

      setFavoriteRoutes(updatedRoutes);

      await AsyncStorage.setItem(
        "favoriteRoutes",
        JSON.stringify(updatedRoutes)
      );
    } catch (error) {
      console.error("Erro ao excluir a rota favorita:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteRoutes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Favoritos</Text>
      </View>

      {favoriteRoutes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma rota favorita</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteRoutes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.routeItem}>
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>Local: {item.localAtual}</Text>
                <Text style={styles.routeName}>
                  Destino: {item.localDesejado}
                </Text>
                <Text style={styles.horario}>Horário: {item.horario}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteRoute(item)}
                style={styles.routeButton}
              >
                <Text style={styles.routeButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  routeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 13,
    backgroundColor: "#f0f0f0",
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
  },
  horario: {
    fontSize: 14,
    color: "#666",
  },
  routeButton: {
    backgroundColor: "#D32F2F",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    width: 115,
    alignItems: "center",
  },
  routeButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});

export default Favorites;
