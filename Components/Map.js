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
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const Map = () => {
  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [polylineCoords, setPolylineCoords] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await getLocation();
        setLoadingLocation(false);
      } else {
        console.log("Permissão de localização não concedida.");
      }
    })();
  }, []);

  const getLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Erro ao obter localização:", error);
    }
  };

  const handleSearch = async () => {
    if (searchText) {
      try {
        const result = await Location.geocodeAsync(searchText);
        if (result.length > 0) {
          const firstResult = result[0];
          const newRegion = {
            latitude: firstResult.latitude,
            longitude: firstResult.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: firstResult.latitude,
            longitude: firstResult.longitude,
          });

          if (reverseGeocode.length > 0) {
            const subregion = reverseGeocode[0].subregion;
            setSearchResult({
              name: firstResult.formattedAddress,
              formattedAddress: firstResult.formattedAddress,
              latitude: firstResult.latitude,
              longitude: firstResult.longitude,
              subregion: subregion,
            });
          } else {
            setSearchResult(null);
          }

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

  const handleSaveRoute = async () => {
    if (searchResult && location) {
      try {
        let localAtual = "Sua Localização Atual";
        if (location) {
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (reverseGeocode.length > 0) {
            localAtual = reverseGeocode[0].subregion;
          }
        }

        let route = {
          localAtual: localAtual,
          localDesejado: searchResult
            ? searchResult.subregion
            : "Destino não encontrado",
          horario: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        const savedRoutes = await AsyncStorage.getItem("favoriteRoutes");
        let routes = savedRoutes ? JSON.parse(savedRoutes) : [];
        routes.push(route);
        await AsyncStorage.setItem("favoriteRoutes", JSON.stringify(routes));

        console.log("Rota salva com sucesso:", route);
      } catch (error) {
        console.error("Erro ao salvar a rota:", error);
      }
    }
  };

  const markers = [];
  const polyline =
    polylineCoords.length === 2 ? (
      <Polyline
        coordinates={polylineCoords}
        strokeWidth={3}
        strokeColor="#7289DA"
      />
    ) : null;

  if (searchResult) {
    markers.push(
      <Marker
        key="destinationMarker"
        coordinate={{
          latitude: searchResult.latitude,
          longitude: searchResult.longitude,
        }}
        title="Destino"
        description={searchResult.formattedAddress}
      />
    );
  }

  if (location) {
    markers.push(
      <Marker
        key="currentLocationMarker"
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title="Sua Localização Atual"
        description="Você está aqui"
      >
        <Feather name="truck" size={26} color="#7289DA" />
      </Marker>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Mapa</Text>
      </View>
      {loadingLocation && (
        <View style={styles.loadContainer}>
          <Text style={styles.load}>Carregando a localização...</Text>
        </View>
      )}
      {!loadingLocation && (
        <View style={styles.mapContainer}>
          {mapRegion && (
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              key={`${mapRegion.latitude}_${mapRegion.longitude}`}
            >
              {markers}
              {polyline}
            </MapView>
          )}
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
          <TouchableOpacity onPress={handleSaveRoute} style={styles.button}>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
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
    backgroundColor: "#222",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
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
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 8,
    color: "#000",
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
    marginTop: 12,
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
    marginBottom: 10,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Map;
