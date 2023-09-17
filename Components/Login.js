import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Preencha todos os campos.");

      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setError("");
      if (true) {
        navigation.replace("TabRoutes");
      } else {
        setError("Credenciais incorretas. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CargaDireta</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      {error !== "" && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#7289da" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F1F23",
  },

  input: {
    width: 300,
    height: 40,
    borderColor: "#7289da",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 50,
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    borderStyle: "solid",
  },
  buttonContainer: {
    width: 300,
  },
});

export default Login;
