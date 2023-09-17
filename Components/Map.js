import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

function Map() {
  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [polylineCoords, setPolylineCoords] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização não concedida.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleSearch = async () => {
    if (searchText) {
      try {
        const result = await Location.geocodeAsync(searchText);
        if (result.length > 0) {
          const firstResult = result[0];
          setSearchResult({
            name: firstResult.name,
            formattedAddress: firstResult.formattedAddress,
            latitude: firstResult.latitude,
            longitude: firstResult.longitude,
          });
          const newRegion = {
            latitude: firstResult.latitude,
            longitude: firstResult.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setMapRegion(newRegion);
          updatePolyline();
        } else {
          setSearchResult(null);
        }
      } catch (error) {
        console.error("Erro ao pesquisar local:", error);
        setSearchResult(null);
      }
    }
  };

  const handleTextChange = (text) => {
    setSearchText(text);
  };

  const clearSearchText = () => {
    setSearchText("");
  };

  const updatePolyline = () => {
    if (location && searchResult) {
      const coords = [
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        {
          latitude: searchResult.latitude,
          longitude: searchResult.longitude,
        },
      ];
      setPolylineCoords(coords);
    }
  };

  const clearLocationAndRoute = () => {
    setSearchResult(null);
    setPolylineCoords([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {mapRegion ? (
          <MapView
            style={styles.map}
            initialRegion={mapRegion}
            key={`${mapRegion.latitude}_${mapRegion.longitude}`}
          >
            {searchResult && (
              <Marker
                coordinate={{
                  latitude: searchResult.latitude,
                  longitude: searchResult.longitude,
                }}
                title={searchResult.name}
                description={searchResult.formattedAddress}
              />
            )}

            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Local Atual"
                description="Você está aqui"
              >
                <Feather name="truck" size={24} color="red" />
              </Marker>
            )}

            {polylineCoords.length === 2 && (
              <Polyline
                coordinates={polylineCoords}
                strokeWidth={3}
                strokeColor="red"
              />
            )}
          </MapView>
        ) : null}
      </View>
      {!location && (
        <View style={styles.loadContainer}>
          <Text style={styles.load}>Carregando a localização...</Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Para onde você quer ir?"
            onChangeText={handleTextChange}
            value={searchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={clearSearchText}
              style={styles.clearButton}
            >
              <Feather name="x" size={20} color="#7289da" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Pesquisar</Text>
        </TouchableOpacity>
      </View>

      {searchResult && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={updatePolyline} style={styles.button}>
            <Text style={styles.buttonText}>Gerar Rota</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Salvar Rota</Text>
          </TouchableOpacity>
        </View>
      )}

      {searchResult && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={clearLocationAndRoute}
            style={styles.buttonDelete}
          >
            <Text style={styles.buttonText}>Excluir Rota</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 75,
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  loadContainer: {
    flex: 1,
    alignItems: "center",
  },
  load: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    borderRadius: 8,
    color: "#000",
  },
  clearButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    backgroundColor: "#7289DA",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "#7289DA",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    flex: 1,
    marginLeft: 8,
  },
  buttonDelete: {
    backgroundColor: "#D32F2F",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Map;