import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const { height, width } = Dimensions.get("window");

type RootStackList = {
  Home: undefined;
  explore: { screen: string };
  Register: undefined;
  Rotina: { id: number };
  diario: { id: number };
  minhaRotina2: { id: string; name: string };
  meuDiario: undefined;
  meusDiarios: { id: string; dado: string };
  selectDiario: { descr: string };
  dinheiro: undefined;
  divisao: undefined;
  receberMoney: { id: number, titulo: string };
};

export default function DinheiroScreen() {
  const [nomeSalvo, setNomeSalvo] = useState<string>("");
  const [arquivos, setArquivos] = useState<string[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackList, "dinheiro" >>();
  const [arquivo, setArquivo] = useState<number[]>([])
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  const userName = async () => {
    const name = await AsyncStorage.getItem("userName");
    if (name) {
      setNomeSalvo(name);
    }
  };

  const toggleView = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index); // Mostra/oculta o view específico
  };

  const receber = async () => {
    try {
      
      let reqs = await fetch("http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberFinancas", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nameUser: nomeSalvo }),
      });

      const response = await reqs.json();

      if (reqs.status === 200) {
        setArquivos(response.idade);
        setArquivo(response.image)
      } else {
        console.error("Erro no status da API.");
      }
    } catch (error) {
      console.error("Erro no receber: " + error);
    }
  };
  console.log('nome: ' + nomeSalvo)
//userName();
useEffect(() => {
  if (nomeSalvo) {
    const inter = setInterval(()=>{
      receber()
    },2000)

    return () => clearInterval(inter)
  }
}, [nomeSalvo]);

  useFocusEffect(
    useCallback(() => {
      userName();
    }, [nomeSalvo])
  );

  const deleteItem = async (itemId: number) => {
    try {
      const reqs4 = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/delete', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeUser: nomeSalvo, idUser: itemId }),
      });
  
      if (reqs4.status === 200) {
        // Atualiza os estados removendo o item pelo ID
        setArquivos((prevArquivos) =>
          prevArquivos.filter((item, index) => arquivo[index] !== itemId)
        );
        setArquivo((prevArquivo) =>
          prevArquivo.filter((item) => item !== itemId)
        );
      } else {
        console.error('Erro na exclusão do item.');
      }
    } catch (error) {
      console.error('Erro ao tentar excluir o item:', error);
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
        {/* Botão de retorno */}
        <TouchableOpacity
          style={styles.retorno}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle-outline" size={43} color={"white"} />
        </TouchableOpacity>

        {/* Botão Criar Arquivo */}
        <TouchableOpacity
          style={styles.create}
          onPress={() => navigation.navigate("divisao")}
        >
          <Text style={styles.createText}>Criar Arquivo</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Arquivos</Text>

        {/* FlatList */}
        <FlatList
          data={arquivos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              {/* Botão para abrir a tela de detalhes */}
              <TouchableOpacity onPress={() => navigation.navigate('receberMoney', { id: arquivo[index], titulo: item })}>
                <Text style={styles.itemText}>💰{item.replace('Finança: ', '')}</Text>
              </TouchableOpacity>

              {/* Botão "..." e texto condicional */}
              <View>
                <TouchableOpacity onPress={() => toggleView(index)}>
                  <Text style={styles.dots}>...</Text>
                </TouchableOpacity>

                {/* Exibe o texto abaixo do botão "..." se estiver visível */}
                {visibleIndex === index && (
                  <View style={styles.smallView}>
                    <TouchableOpacity onPress={()=>deleteItem(arquivo[index])} >
                      <Text style={{color: 'red'}} >Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Nenhum arquivo encontrado.</Text>
          )}
        />
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
    padding: 16,
  },
  retorno: {
    marginBottom: 16,
  },
  create: {
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    height: height * 0.05,
    marginBottom: 16,
  },
  createText: {
    color: "white",
    fontSize: width * 0.053,
  },
  title: {
    fontSize: width * 0.05,
    color: "white",
    marginBottom: 16,
    fontWeight: 'bold'
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Alinha os dois blocos (ícone e botão ...)
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    marginVertical: 5,
  },
  itemText: {
    color: 'white',
    fontSize: width * 0.05, // Ajuste o tamanho para corresponder ao layout
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 16,
  },
  dots: {
    color: 'white',
    fontSize: width * 0.06, // Tamanho do botão "..."
    textAlign: 'center', // Centraliza o botão no eixo horizontal
  },
  extraView: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  extraText: {
    color: 'black',
    fontSize: 16,
  },
  smallView: {
    marginTop: 5, // Dá um pequeno espaço entre o botão e o texto
    backgroundColor: '#2C2C2C', // Cor do fundo para destaque
    padding: 5,
    borderRadius: 5,
  },
  smallText: {
    color: 'white',
    fontSize: 12, // Texto pequeno
  },
});
