import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    alterSenha: undefined;
    sobre: undefined;
    cronometro: undefined;
  };
  

export default function ConfigScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackList, "explore">>()

  return (
    <LinearGradient
      colors={['#1C1C1C', '#363636']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Configurações</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('alterName')} >
            <Text style={styles.buttonText}>Alterar Nome</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('alterSenha')} >
            <Text style={styles.buttonText}>Alterar Senha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('sobre')} >
            <Text style={styles.buttonText}>Sobre o App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={async() => {navigation.navigate('Home')
            await AsyncStorage.setItem('last', 'Home')
          }} >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 100,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50, // Reduzindo o espaçamento abaixo do título
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Alterado para menos espaçamento entre os botões
    gap: 35, // Adicionando um espaçamento fixo entre os botões
  },
  button: {
    backgroundColor: '#4A4A4A',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

