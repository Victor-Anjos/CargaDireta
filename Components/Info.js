import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const Info = () => {
  const infoData = [
    {
      id: 1,
      iconName: "alert-triangle",
      name: "Descida perigosa",
      description:
        "Descida íngreme com curvas perigosas. Reduza a velocidade e use os freios com cautela.",
    },
    {
      id: 2,
      iconName: "search",
      name: "Ponto interessante",
      description:
        "Desfrute da vista panorâmica neste ponto específico, conhecido por sua beleza natural e atrativos turísticos.",
    },
    {
      id: 3,
      iconName: "droplet",
      name: "Posto de gasolina",
      description:
        "Encontre um posto de gasolina próximo para garantir que seu veículo esteja sempre abastecido.",
    },
    {
      id: 4,
      iconName: "compass",
      name: "Ponto de descanso",
      description:
        "Este local oferece um espaço tranquilo para pausas durante sua viagem, com instalações como banheiros e lanchonetes.",
    },
    {
      id: 5,
      iconName: "alert-octagon",
      name: "Via obstruída",
      description:
        "Via temporariamente obstruída devido a obras ou eventos. Considere rotas alternativas para evitar a interrupção.",
    },
  ];

  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpanded = (itemId) => {
    setExpandedItem((prevItem) => (prevItem === itemId ? null : itemId));
  };

  const renderDetails = (description) => {
    return (
      <View style={styles.infoDetails}>
        <Text style={styles.infoDetailsText}>{description}</Text>
      </View>
    );
  };

  const renderInfoItem = (item) => {
    const isExpanded = expandedItem === item.id;

    return (
      <View key={item.id}>
        <TouchableOpacity
          onPress={() => toggleExpanded(item.id)}
          style={styles.infoItemContainer}
        >
          <View style={styles.infoItem}>
            <Feather name={item.iconName} style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.name}</Text>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>
        {isExpanded && renderDetails(item.description)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Informativos simbólicos</Text>
      </View>
      {infoData.map(renderInfoItem)}
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
  infoItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  infoIcon: {
    fontSize: 22,
    marginRight: 8,
    color: "#7289DA",
  },
  infoText: {
    flex: 1,
    fontSize: 22,
  },
  expandIcon: {
    fontSize: 22,
    color: "#7289DA",
  },
  infoDetails: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  infoDetailsText: {
    fontSize: 16,
    padding: 10,
  },
});

export default Info;
