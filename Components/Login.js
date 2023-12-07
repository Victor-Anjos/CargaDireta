import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Preencha todos os campos.");

      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setError("");
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("Usuário logado:", user);
          navigation.replace("TabRoutes");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError("Credenciais incorretas. Tente novamente.");
          console.error(errorMessage);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Carga Direta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
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
    borderBottomColor: "#7289da",
    color: "white",
    borderBottomWidth: 1,
    marginBottom: 20,
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
    marginBottom: 30,
  },
  buttonContainer: {
    width: 300,
    marginTop: 15,
  },
});

export default Login;
