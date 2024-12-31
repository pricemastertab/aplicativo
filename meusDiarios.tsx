import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from '@react-navigation/stack';

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
  dinheiro: undefined;
};

type boos = {
  bod: boolean
}

const { width, height } = Dimensions.get('window');

export default function MeusDiarios() {
  const route = useRoute<RouteProp<RootStackList, "meusDiarios">>();
  const [biografia, setBiografia] = useState<string[]>([]);
  const [biografias, setBiografias] = useState<string[]>([]);
  const [isNew, setIsNew] = useState<boolean[]>([]);
  const [nomeSalvo, setNomeSalvo] = useState<string>('');
  const navigation = useNavigation<StackNavigationProp<RootStackList>>();
  const { id, dado } = route.params;
  const [vala, setVala] = useState<boos[]>([])

  const userName = async () => {
    const nam = await AsyncStorage.getItem('userName');
    if (nam) {
      setNomeSalvo(nam);
    }
  };

  const mudarAd = (index: number) => {
    setVala((prevState) => {
      const updatedVala = [...prevState];
      updatedVala[index] = { bod: !updatedVala[index].bod };
      return updatedVala;
    });
  };
  

  useFocusEffect(
    React.useCallback(() => {
      userName();
    }, [])
  );

  const receberDiario = async () => {
    try {
      let reqs = await fetch("http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberPaginas", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUser: id }),
      });
  
      const response = await reqs.json();
      if (reqs.status === 200) {
        setBiografia(response.biografia);
        setBiografias(response.numero);
        setIsNew(new Array(response.biografia.length).fill(false));
        setVala(new Array(response.biografia.length).fill({ bod: false }));
      }
    } catch (error) {
      console.error("Erro no código: " + error);
    }
  };
  
  const deletarDado = async (valor: string, index: number) => {
    try {
      let requi = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/deletarInfo', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameUser: nomeSalvo,
          valorUser: valor,
        }),
      });
  
      if (requi.status === 200) {
        // Atualize o estado removendo o item correspondente
        setBiografia((prevBiografia) => prevBiografia.filter((_, idx) => idx !== index));
        setBiografias((prevBiografia1) => prevBiografia1.filter((_, idx) => idx !== index));
        setVala((prevVala)=>prevVala.filter((_,idx) => idx !== index))
      } else {
        Alert.alert('Erro ao deletar');
      }
    } catch (error) {
      console.error('Erro no deletarDado: ' + error);
    }
  };
  

  const handleAddNewPage = () => {
    setBiografia([...biografia, ""]);
    setBiografias([...biografias, ""]);
    setIsNew([...isNew, true])
    setVala((prevState) => [...prevState, {bod: false}])
  };

  const handleSave = async (index: number) => {
    if (isNew[index]) {
      add(biografia[index]);
      setIsNew((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    } else {
      editarDado(biografias[index], biografia[index]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      receberDiario();
    }, [])
  );

  const add = async (text: string) => {
    try {
      await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/mandarDiario2', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nomeUser: nomeSalvo,
          idUser: id,
          dado: dado,
          tarefa: text
        })
      });
    } catch (error) {
      console.error('ERRO na função add: ' + error);
    }
  };

  const handleEdit = (text: string, index: number) => {
    const updatedBiografia = [...biografia];
    updatedBiografia[index] = text;
    setBiografia(updatedBiografia);
  };

  const editarDado = async (dado: string, descr: string) => {
    try {
      let reqs = await fetch("http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/uptadeDiario", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ antigo: dado, novo: descr }),
      });
      if (reqs.status !== 200) {
        console.error("Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#1C1C1C", "#363636"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>

        <FlatList
          data={biografia}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.itemView}>
              <TouchableOpacity onPress={() => mudarAd(index)} ><Text style={{fontSize: 22}} >...</Text></TouchableOpacity>
              {
                vala[index]?.bod ? (
                  <TouchableOpacity onPress={() => deletarDado(biografias[index], index)} >
                    <Text style={{color: 'red'}} >Excluir</Text>
                  </TouchableOpacity>
                ) : null
              }
              <TextInput
                multiline
                numberOfLines={4}
                style={styles.input}
                placeholder="Digite aqui sua biografia..."
                placeholderTextColor="#AAAAAA"
                onChangeText={(text) => handleEdit(text, index)}
                value={biografia[index]}
              />
              <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(index)}>
                <Text style={styles.saveText}>
                  {isNew[index] ? "Adicionar" : "Salvar alteração"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flat}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddNewPage}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Criar página</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 8, borderRadius: 8, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}} onPress={() => navigation.navigate('explore', {screen: 'Profile'})} >
          <Ionicons name="checkmark-circle-outline" size={24} color={'white'} />
          <Text style={{color: 'white', fontSize: width * 0.04}} >Salvar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  itemView: {
    backgroundColor: "#4A4A4A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  input: {
    width: "100%",
    color: "white",
    fontSize: 16,
    textAlignVertical: "top",
    borderRadius: 8,
    backgroundColor: "#2C2C2C",
    padding: 10,
    height: height * 0.2,
  },
  saveButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontSize: 16,
  },
  flat: {
    flexGrow: 1,
  },
  addButton: {
    backgroundColor: "#0066CC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 8,
  },
});
