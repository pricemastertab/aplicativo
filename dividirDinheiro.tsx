import React, { useState } from "react";
import {View, Text,TouchableOpacity, StyleSheet, SafeAreaView, TextInput, FlatList} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

const {width, height} = Dimensions.get('window')

type Tarefa = {
    texto: string;
    adicionada: boolean;
  };

type Valor = {
    valor: number;
    adicionada: boolean;
}

type Dado = {
    valor: boolean
}

type RootStackList = {
    Home: undefined;
    explore: { screen: string };
    Register: undefined;
    Rotina: { id: number };
    diario: { id: number };
    minhaRotina2: { id: string; name: string };
    meuDiario: undefined;
    meusDiarios: { id: string; dado: string };
    selectDiario: undefined;
    dinheiro: undefined;
    divisao: undefined;
    receberMoney: { id: number };
    cronometro: undefined;
};

export default function divisionScreen(){
    const [valores, setValores] = useState<string[]>([])
    const [inputs, setInputs] = useState<Tarefa[]>([])
    const [titulo, setTitulo] = useState<string>('')
    const [valor, setValor] = useState<Valor[]>([])
    const [id, setId] = useState<number>(0)
    const [nomeSalvo,setNomeSalvo] = useState<string>('')
    const [tituloValor, setTituloValor] = useState<Dado[]>([])
    const navigation = useNavigation<StackNavigationProp<RootStackList, "divisao">>()

    const userName = async() => {
        const name = await AsyncStorage.getItem('userName')
        if (name){
            setNomeSalvo(name)
        }
    }

    useFocusEffect(
        React.useCallback(()=>{
            userName()
        },[])
    )
 
    const handleInputChange = (text: string, index: number) => {
        const newInputs = [...inputs];
        newInputs[index].texto = text;
        setInputs(newInputs);
    };

    const handleMoney = (money: string, index: number) => {
        const numericValue = money.replace(/\D/g, ''); // Remove caracteres não numéricos
        const formattedValue = (Number(numericValue) / 100).toFixed(2); // Divide por 100 e formata com 2 casas decimais
        const newMoney = [...valor];
        newMoney[index].valor = parseFloat(formattedValue); // Atualiza o valor no índice
        setValor(newMoney);
    };
    
    const receberId = async() => {
        try{
            let reqs = await fetch ('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberId',{
                method: 'GET    ',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": 'application/json'
                },
            })

            const response = await reqs.json()
            
            if (reqs.status === 200){
                console.log(parseInt(response.dado) + 1)
                let re = parseInt(response.dado) + 1
                setId(re)
            } else {
                return;
            }
        } catch (error){
            console.error('Erro no receberId: ' + error)
        }
    }

    const addFinanca = async(index: number) => {
        try{
            let req = await fetch ('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/financa', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nomeUser: nomeSalvo,
                    idUser: id,
                    produtoUser: inputs[index]?.texto,
                    precoUser: valor[index]?.valor.toFixed(2), // Usa ponto como separador decimal
                    tituloUser: titulo
                })
                
            })

            const response = await req.json()

            if (req.status === 200){
                setTituloValor((prevState) =>
                    prevState.map((item,i) =>
                        i === index ? {...item, valor: !item.valor} :
                        item
                    ) 
                )
            } else {
                return;
            }

        } catch (error){
            console.error('Erro no addFinanca: ' + error)
        }
    }

    useFocusEffect(
        React.useCallback(()=>{
            receberId()
        },[])
    )

    const addInput = () => {
        setInputs((prevState) => [...prevState, {texto: "", adicionada: false}])
        setValor((prevStat)=>[...prevStat, {valor: 0, adicionada: false}])
        setTituloValor((prevStates)=>[...prevStates, {valor: true}])
    }


    return(
        <LinearGradient colors={['#1C1C1C', '#363636']} start={{x: 1, y: 1}} end={{x:0, y:0}} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
    <View style={{ marginTop: height * 0.05, alignItems: 'center' }}>
        <TextInput
            placeholder="Título do arquivo"
            placeholderTextColor={'white'}
            style={{
                fontSize: width * 0.04,
                borderWidth: 1,
                borderColor: 'white',
                width: width * 0.8, // Ajusta a largura
                color: 'white',
                paddingHorizontal: 10,
                borderRadius: 5, // Torna visual mais amigável
            }}
            onChangeText={(text) => setTitulo(text)}
            value={titulo} // Assegura que o valor seja controlado
        />
    </View>

    <FlatList
        data={inputs}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
            <View style={styles.inputContainer}>
                <View style={styles.inputs}>
                    <TextInput
                        placeholder="Item"
                        placeholderTextColor="white"
                        onChangeText={(text) => handleInputChange(text, index)}
                        style={styles.input}
                        numberOfLines={21}
                        multiline={true}
                    />
                    <TextInput
                        placeholder="0,00"
                        placeholderTextColor="white"
                        keyboardType="numeric"
                        value={valor[index]?.valor.toFixed(2).replace('.', ',')} // Formata para exibição no estilo brasileiro
                        onChangeText={(text) => handleMoney(text, index)} // Chama a lógica para atualizar o valor
                        style={styles.input}
                    />
                    <TouchableOpacity
                        style={styles.mandar}
                        onPress={() => addFinanca(index)}
                    >
                        <Text style={{ color: 'white', fontSize: width * 0.06 }}>
                            {tituloValor[index]?.valor ? 'Adicionar' : 'Adicionado'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}
    />
    <TouchableOpacity onPress={addInput} style={styles.add}>
        <Text style={{ color: 'white', fontSize: width * 0.05 }}>Adicionar Bloco</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: 'green',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
        }}
        onPress={() => navigation.navigate('dinheiro')}
    >
        <Text style={{ color: 'white', fontSize: width * 0.04 }}>Salvar</Text>
    </TouchableOpacity>
</SafeAreaView>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retorno: {
        marginVertical: height * 0.040,
        right: width * 0.25
    },
    titleInput: {
        fontSize: width * 0.04,
        borderWidth: 1,
        borderColor: 'white',
        width: width * 0.45,
        marginBottom: 10,
        color: 'white',
    },
    flatListContent: {
        paddingBottom: 20, // Garante espaço entre o último item e o botão
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10, // Espaço entre os itens
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: width * 0.05,
        textAlignVertical: 'top', // Coloca o texto no topo
        textAlign: 'left', // Alinha o texto à esquerda
        borderWidth: 1,
        borderColor: 'white',
        height: height * 0.06,
        marginHorizontal: 5, // Espaçamento entre os campos de texto
        width: width * 0.4
    },
    add: {
        borderWidth: 1,
        borderColor: 'white',
        padding: 5,
        borderRadius: 7,
        alignItems: 'center',
        marginTop: 10, // Garante que o botão fique visível após os itens
    },
    mandar: {
        width: width * 0.43,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center'
    }
});
