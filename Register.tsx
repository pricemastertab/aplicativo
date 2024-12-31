import React,{useState} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
export default function RegisterScreen(){
    const [nome, setNome] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [confirma, setConfirma] = useState<string>('')
    const navigation = useNavigation<StackNavigationProp<RootStackList>>()

    const criar = async() => {
        try{
            if (nome && senha && confirma){
                if (senha === confirma){
                    let reqs = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/criar',{
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nomeUser: nome, senhaUser: senha })
                    })

                    if ( reqs.status === 200 ){
                        await AsyncStorage.setItem('userName', nome)
                        await AsyncStorage.setItem('last', 'Profile'); // Salve a rota
                        navigation.navigate('explore', {screen: 'dado'})
                    } else{
                        Alert.alert('conta já existente')
                    } 
                } else {
                    Alert.alert('Senhas não coincidem')
                }
            } else {
                Alert.alert('preencha os campos')
            }
        } catch(error){
            console.error('Erro na funcção criar')
        }
    }

    const voltar = () => {
        navigation.navigate('Home')
    }

    return (
        <LinearGradient colors={['#1C1C1C', '#363636']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={styles.container}>
            <SafeAreaView>
                <View>
                    <Text style={styles.brainText} >BrainGen</Text>
                    <TextInput
                      placeholder='Nome'
                      placeholderTextColor={'white'}
                      onChangeText={(text)=>setNome(text)}
                      style={styles.nome}
                    />
                    <TextInput
                      placeholder='Senha'
                      placeholderTextColor={'white'}
                      onChangeText={(text)=>setSenha(text)}
                      style={styles.senha}
                    />
                    <TextInput
                      placeholder='Confirma senha'
                      placeholderTextColor={'white'}
                      onChangeText={(text)=>setConfirma(text)}
                      style={styles.confirma}
                    />
                    <TouchableOpacity style={styles.create} onPress={criar}>
                        <Text style={{ fontSize: 27, color: 'white' }} >Criar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', top: '95%' }} onPress={()=>navigation.navigate('Home')}>
                        <Text style={{ color: 'white' }} >Fazer login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    brainText: {
        fontSize: 55,
        color: 'white',
        fontWeight: '100',
        bottom: '110%'
    },
    nome: {
        fontSize: 23,
        bottom: '70%',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        width: '145%',
        right: '23%',
        color: 'white'
    },
    senha: {
        fontSize: 23,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        width: '145%',
        right: '23%',
        bottom: '10%',
        color: 'white'
    },
    confirma: {
        fontSize: 23,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        width: '145%',
        right: '23%',
        top: '50%',
        color: 'white'
    },
    create: {
        alignItems: 'center',
        justifyContent:'center',
        borderWidth: 1,
        top: '80%',
        borderColor: 'white'
    }
})