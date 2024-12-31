import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { useFocusEffect } from "expo-router";

const { width, height } = Dimensions.get("window");
type RootStackList = {
  Home: undefined;
  explore: { screen: string };
  Register: undefined;
  Rotina: { id: number };
  diario: { id: number };
  minhaRotina2: { id: string, name: string };
  meuDiario: undefined;
  meusDiarios: { id: string, dado: string };
  selectDiario: { descr: string };
};

export default function Login() {
  const [nome, setNome] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackList>>();

  const entrarConta = async () => {
    try {
      if (nome && senha) {
        const response = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/entrar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nomeUser: nome, senhaUser: senha }),
        });
  
        if (response.status === 200) {
          await AsyncStorage.setItem('userName', nome);
          await AsyncStorage.setItem('last', 'Profile'); // Salve a rota
          navigation.navigate('explore',{screen: 'Profile'})
        } else {
          Alert.alert('Erro ao entrar, verifique o nome e senha');
        }
      } else {
        Alert.alert('Preencha os campos');
      }
    } catch (error) {
      console.error('Erro ao entrar na conta:', error);
    }
  };
  
  return (
    <LinearGradient
    colors={['#1C1C1C', '#363636']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView>
        <View>
          <Text style={styles.text}>BrainGen</Text>
          <TextInput
            placeholder="Nome"
            onChangeText={(text) => setNome(text)}
            placeholderTextColor={"white"}
            style={styles.name}
          />
          <TextInput
            placeholder="Senha"
            onChangeText={(text) => setSenha(text)}
            placeholderTextColor={"white"}
            style={styles.senha}
          />
          <TouchableOpacity onPress={entrarConta} style={styles.entrar}>
            <Text style={styles.entrarText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createBu}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.createText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: width * 0.14,
    fontWeight: "100",
    bottom: height * 0.13, // Ajuste proporcional ao tamanho da tela
    alignSelf: "center",
  },
  name: {
    fontSize: width * 0.053,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    width: width * 0.8, // Ajusta proporcionalmente à largura da tela
    color: "white",
    marginBottom: height * 0.3,
  },
  senha: {
    fontSize: width * 0.053,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    width: width * 0.8, // Ajusta proporcionalmente à largura da tela
    color: "white",
    bottom: height * 0.1,
  },
  entrarText: {
    color: "white",
    fontSize: width * 0.06,
    fontWeight: "300",
  },
  entrar: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    padding: 7,
    marginBottom: 20,
    width: width * 0.5,
    left: width * 0.15
  },
  createText: {
    color: "white",
  },
  createBu: {
    alignItems: "center",
    justifyContent: "center",
  },
});
