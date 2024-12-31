import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { Dimensions } from "react-native";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

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

type Preco = {
  valor: string;
  bod: boolean;
};

type Tarefa = {
  texto: string;
  bod: boolean;
}

const { width, height } = Dimensions.get("window");

export default function ReceberDinheiro() {
  const route = useRoute<RouteProp<RootStackList, "receberMoney">>();
  const { id, titulo } = route.params;
  const [nomeSalvo, setNomeSalvo] = useState<string>("");
  const [financas, setFinancas] = useState<{ texto: string; valor: string }[]>([]);
  const [newBlocks, setNewBlocks] = useState<{ texto: string; valor: string }[]>([]);
  const [preco, setPreco] = useState<Preco[]>([]);
  const [ids, setIds] = useState<string[]>([])
  const navigation = useNavigation<StackNavigationProp<RootStackList, "receberMoney">>()
  const [sum, setSum] = useState<number>(0)
  const [item, setItem] = useState<Tarefa[]>([])

  const somas = () => {
    const soma = preco
      .map(Number)
      .reduce((acumulador, atual) => acumulador + atual, 0);
    setSum(soma)
  }

  useFocusEffect(
    React.useCallback(()=>{
      somas()
    },[])
  )

  const userName = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      if (name) {
        setNomeSalvo(name);
      }
    } catch (error) {
      console.error("Erro ao obter nome do AsyncStorage:", error);
    }
  };

  const handleInputChange = (
    field: "texto" | "valor",
    value: string,
    index: number,
    listType: "financas" | "newBlocks"
  ) => {
    const updatedList = listType === "financas" ? [...financas] : [...newBlocks];
  
    if (field === "valor") {
      // Remover todos os caracteres não numéricos
      value = value.replace(/\D/g, "");
  
      // Garantir que pelo menos três dígitos estejam presentes
      if (value.length < 3) {
        value = value.padStart(3, "0");
      }
  
      // Formatar o valor em reais com centavos
      value = `${parseInt(value.slice(0, -2), 10)},${value.slice(-2)}`;
    }
  
    // Atualizar o campo no item correspondente
    updatedList[index][field] = value;
  
    // Atualizar o estado correto
    listType === "financas" ? setFinancas(updatedList) : setNewBlocks(updatedList);
  };
  
  const addInput = () => {
    setNewBlocks((prev) => [...prev, { texto: "", valor: "0,00" }]);
    setItem((prevState) => [...prevState, {bod: false, texto: ""}])
  };

  const receberFinanca = async () => {
    if (!nomeSalvo) return;
    try {
      const response = await fetch("http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberOrganizados", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUser: id, nameUser: nomeSalvo }),
      });

      const data = await response.json();
      if (response.ok) {
        setFinancas(
          data.data.map((item: string, index: number) => ({
            texto: data.data2[index],
            valor: item,
          }))
        );
        setIds(data.data3)
      } else {
        console.error("Erro na resposta do servidor:", data.message);
      }
    } catch (error) {
      console.error("Erro no receberFinanca:", error);
    }
  };

  const addUptade = async (index: number) => {
    try {
      // Pega o produto da lista 'financas' e o preço da lista 'newBlocks'
      const produto = item[index]?.texto;
      const prec = preco[index]?.valor;
  
      // Verifique se os valores existem antes de enviar a requisição
      if (!produto || !preco) {
        console.error('Produto ou Preço não fornecido.');
        return;
      }
  
      // Envia os dados ao backend
      let reqs5 = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/financa', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeUser: nomeSalvo,
          idUser: id,
          produtoUser: produto,
          precoUser: prec,
          tituloUser: titulo.replace('Finança: ',''),
        }),
      });
      
      console.log(reqs5.status)
  
      // Checa a resposta da requisição
      if (reqs5.ok) {
        // Remove o item de 'newBlocks' e 'financas' nas respectivas listas
        const updatedNewBlocks = preco.filter((_, idx) => idx !== index);
        const updatedFinancas = item.filter((_, idx) => idx !== index);
  
        // Atualiza os estados com os arrays filtrados
        setPreco(updatedNewBlocks);
        setItem(updatedFinancas);
      } else {
        console.error('Erro ao enviar dados.');
      }
    } catch (error) {
      console.error('Erro no addUptade: ' + error);
    }
  };

  const deletar = (index: number) => {
    setPreco((prev) => prev.filter((_, idx) => idx !== index));
    setItem((prev) => prev.filter((_, idx) => idx !== index));
    setNewBlocks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleProdutoString = (index:number, text: string) => {
    const upta = [...item]
    upta[index].texto = text
    setItem(upta)
  }
  
  

  useEffect(() => {
    if (nomeSalvo) {
      const interva = setInterval(()=>{
        receberFinanca();
      },1100)
      return () => clearInterval(interva)
    }
  }, [nomeSalvo]);

  useFocusEffect(
    React.useCallback(() => {
      userName();
    }, [])
  );

  const atualizar = async(number: string, item: string, valor: string) => {
    try{
      let req2 = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/atualizar',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({nameUser: nomeSalvo, numberUser: number, fraseUser: `${item} ${valor}`})
      })

      if(req2.status === 200){
          return;
      } else {
        return;
      }
    } catch (error){
      console.error('Erro no atualizar: ' + error)
    }
  }

  const handlePreco = (text: string, index: number) => {
    const newPreco = [...preco];
  
    if (!newPreco[index]) {
      newPreco[index] = { valor: "0,00", bod: true };
    }
  
    // Remover todos os caracteres não numéricos
    const numericText = text.replace(/\D/g, "");
  
    // Garantir que sempre haja ao menos um valor para centavos
    const integerValue = parseInt(numericText || "0", 10);
  
    // Formatar o valor em reais com centavos
    const formattedValue = (integerValue / 100).toFixed(2).replace(".", ",");
  
    // Atualizar o estado com o valor formatado
    newPreco[index].valor = formattedValue;
  
    setPreco(newPreco);
  };
  
  
  return (
    <LinearGradient
      colors={["#1C1C1C", "#363636"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, height: height * 0.8}} >
        {/* First FlatList for displaying initial finances */}
        <FlatList
          data={financas}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.listItemRowCentered}>
              <View style={[styles.rowContainer]}>
                <TextInput
                  placeholder="Item"
                  placeholderTextColor={"white"}
                  style={[styles.input, styles.textInput]}
                  value={item.texto}
                  onChangeText={(text) => handleInputChange("texto", text, index, "financas")}
                />
                <TextInput
                  placeholder="0,00"
                  placeholderTextColor={"white"}
                  style={[styles.input, styles.valueInput]}
                  value={item.valor}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("valor", value, index, "financas")}
                />
              </View>
              <TouchableOpacity style={styles.updateButton} onPress={()=>atualizar(ids[index], item.texto, item.valor)} >
                <Text style={styles.updateButtonText}>Atualizar</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={[styles.flat, {bottom: height * 0.1}]}
        />
        </View>

        <Text style={{borderBottomWidth: 1, borderBottomColor: 'orange', width: width * 1, bottom: height*0.01}} ></Text>

        {/* Second FlatList for displaying new blocks */}
        <View style={{flex: 1}} >
        <FlatList
          data={item}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.listItemRowCentered}>
              <TextInput
                placeholder="Item"
                placeholderTextColor={"#b0b0b0"}  // Cor mais suave para o texto do placeholder
                style={[styles.input, styles.textInput, {width: width * 0.5}]}
                value={item.texto}
                onChangeText={(text) => handleProdutoString(index, text)}
              />
              <TextInput
                placeholder="0,00"
                placeholderTextColor={"#b0b0b0"}  // Cor mais suave para o texto do placeholder
                style={[styles.input, styles.valueInput,{width: width * 0.25, textAlign: 'left'}]}
                value={preco[index]?.valor || "0,00"}
                keyboardType="numeric"
                onChangeText={(text) => handlePreco(text, index)}
              />
              <View style={{flexDirection: 'row'}} >
                <TouchableOpacity style={styles.addButton} onPress={() => addUptade(index)}>
                  <Text style={styles.addButtonText}>Adicionar Bloco</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', top: height * 0.01, left: width * 0.03}} onPress={() => deletar(index)} >
                  <Text style={{color: 'red', fontSize: width * 0.04}} >deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={[styles.flat, { flexGrow: 1, width: width * 0.9, bottom: height * 0.08 }]}  // Melhor controle do layout e maior largura
          inverted={false}  // Garante que os novos blocos sejam adicionados na parte inferior
        />
        </View>
        <View style={{flexDirection: 'row'}} >
        <TouchableOpacity style={styles.addButton} onPress={addInput}>
          <Text style={styles.addButtonText}>Adicionar bloco</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'gray', height: height * 0.05, borderRadius: 7, justifyContent: "center", top: height * 0.025}} onPress={() => navigation.navigate('explore',{screen: 'Profile'})} >
          <Text style={{color: 'white', fontSize: width * 0.06, width: width * 0.3, textAlign:'center', borderRadius: 14}} >cancelar</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 10,
  },
  safeArea: { 
    flex: 1, 
    alignItems: "center",
  },
  voltar: { 
    position: "absolute", 
    top: 20, 
    left: 20,
  },
  listItemRowCentered: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    borderRadius: 12,
    marginVertical: 10,
    padding: 12,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center", // Centers the item horizontally
    // Remove 'top' property to prevent shifting of items
  },
  
  flat: { 
    paddingHorizontal: 2, 
    marginTop: height * 0.13,
  },
  input: {
    flex: 1,
    backgroundColor: "#444",
    borderRadius: 8,
    color: "white",
    padding: 10,
    marginHorizontal: 5,
    fontSize: 16,
    fontFamily: "Roboto",
  },
  textInput: { 
    flex: 2,
  },
  valueInput: { 
    flex: 1, 
    textAlign: "right",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonText: { 
    color: "white", 
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  updateButton: {
    marginTop: 8,
    alignSelf: "center",
    backgroundColor: "#FFA726",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

