import React,{useState} from "react";
import {View, Text, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Alert} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

const { height, width } = Dimensions.get('window')

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
    rotinas2: { id: string };
    gerar: { id: string };
    alterName: undefined;
};

export default function alterNameScreen(){
    const [nomeSalvo, setNomeSalvo] = useState<string>('')
    const [senhaAntiga, setSenhaAntiga] = useState<string>('')
    const [nomeNovo,setNomeNovo] = useState<string>('')
    const navigation = useNavigation<StackNavigationProp<RootStackList, "alterName">>()

    const userName = async() => {
        const name = await AsyncStorage.getItem('userName')
        if (name) {
            setNomeSalvo(name)
        }
    }

    useFocusEffect(
        React.useCallback(()=>{
            userName()
        },[])
    )

    const atualizar = async() => {
        try{
            if (senhaAntiga && nomeNovo){
                let reqs = await fetch ('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/atualizarNome',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nomeUser: nomeSalvo, senhaUser: senhaAntiga, novoNome: nomeNovo })
                })

                if (reqs.status === 200){
                    await AsyncStorage.setItem('userName', nomeNovo)
                    navigation.navigate('explore',{screen: 'Profile'})
                } else {
                    Alert.alert('Nome já existente')
                }
            } else {
                Alert.alert('preencha o campo')
            }
        } catch (error){
            console.error('erro no atualizar: ' + error)
        }
    }

    return (
        <LinearGradient colors={["#1C1C1C", "#363636"]} start={{x:1,y:1}} end={{x:0, y:0}} style={styles.container} >
            <SafeAreaView>
                <View style={styles.viewUptade} >
                    <TouchableOpacity onPress={()=>navigation.navigate('explore', {screen: 'configurações'})} >
                        <Ionicons name="arrow-back-circle-outline" size={40} color={'white'} />
                    </TouchableOpacity>
                    <TextInput
                      placeholder="Senha da conta"
                      onChangeText={(text)=>setSenhaAntiga(text)}
                      placeholderTextColor={'white'}
                      style={styles.senhaAntiga}
                    />
                    <TextInput
                      placeholder="novo nome"
                      placeholderTextColor={'white'}
                      onChangeText={(text)=>setNomeNovo(text)}
                      style={styles.novoNome}
                    />
                    <TouchableOpacity style={styles.salvar} onPress={atualizar}>
                        <Text style={{color: 'white', fontSize: width * 0.04, fontWeight: 'bold'}} >Salvar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewUptade: {
        backgroundColor: '#3c3c3c',
        width: width * 0.85,
        padding: 20,
        height: height * 0.45,
        bottom: height * 0.2,
        borderRadius: 7
    },
    senhaAntiga: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        fontSize: width * 0.05,
        top: height * 0.07,
        color: 'white'
    },
    novoNome: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        fontSize: width * 0.05,
        top: height * 0.14,
        color: 'white'
    },
    salvar: {
        backgroundColor: '#FFA726',
        width: width * 0.4,
        height: height * 0.045,
        justifyContent: 'center',
        alignItems: 'center',
        left: width * 0.18,
        top: height * 0.24,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    }
})