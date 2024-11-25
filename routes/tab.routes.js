import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "../Components/Map";
import Favorites from "../Components/Favorites";
import { Feather } from "@expo/vector-icons";
import Info from "../Components/Info";

const Tab = createBottomTabNavigator();

export default function AuthenticatedApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingHorizontal: 5,
          paddingTop: 10,
          backgroundColor: "rgb(17,18,20)",
          position: "absolute",
        },
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;

          if (route.name === "Mapa") {
            iconName = "map";
          } else if (route.name === "Favoritos") {
            iconName = "star";
          } else if (route.name === "Info") {
            iconName = "info";
          }

          return (
            <Feather
              name={iconName}
              size={size}
              color={focused ? "#7289DA" : color}
            />
          );
        },
        tabBarLabel: "",
      })}
      tabBarOptions={{
        activeBackgroundColor: "rgb(17,18,20)",
        activeTintColor: "blue",
      }}
    >
      <Tab.Screen name="Mapa" component={Map} />
      <Tab.Screen name="Favoritos" component={Favorites} />
      <Tab.Screen name="Info" component={Info} />
    </Tab.Navigator>
  );
}
