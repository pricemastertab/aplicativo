import React, { useCallback, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp } from '@react-navigation/native';
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
};
type Tarefa = {
  texto: string;
  adicionada: boolean;
};

type Dad = {
  valor: boolean;
}

export default function DiarioScreen() {
  const [text, setText] = useState<string>('');
  const [inputs, setInputs] = useState<Tarefa[]>([]);
  const [pagina, setPagina] = useState<string>('');
  const navigation = useNavigation<StackNavigationProp<RootStackList>>();
  const route = useRoute<RouteProp<RootStackList, 'Rotina'>>();
  const [nomeSalvo, setNomeSalvo] = useState<string>('');
  const [mandar1, setMandar1] = useState<string>('Salvar página');
  const [titulo, setTitulo] = useState<string>('');
  const [dados,setDados] = useState<Dad[]>([])

  const receberNome = async () => {
    const name = await AsyncStorage.getItem('userName');
    if (name) {
      setNomeSalvo(name);
    }
  };

  useFocusEffect(
    useCallback(() => {
      receberNome();
    }, [])
  );

  const { id } = route.params;

  const addInput = () => {
    setInputs((prevInputs) => [...prevInputs, { texto: '', adicionada: false }]);
    setDados((prevState) => [...prevState, {valor: false}])
  };

  const mandar = async (index: number) => {
    const tarefa = inputs[index].texto;
    try {
      if (tarefa && titulo){
        let response = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/mandarDiario3', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nomeUser: nomeSalvo, idUser: id, tarefa: tarefa, dado: titulo }),
        });

        if (response.ok) {
          const newInputs = [...inputs];
          newInputs[index].adicionada = true;
          setInputs(newInputs);
          const newDado = [...dados]
          newDado[index].valor = true
          setDados(newDado)
        } else {
          alert('Erro ao enviar a tarefa.');
          console.error('Erro:', response.statusText);
        }
      } else {
        Alert.alert('preencha o(s) campo(s) que faltam')
      }
    } catch (error) {
      console.error('Erro na função mandar:', error);
    }
  };

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index].texto = text;
    setInputs(newInputs);
  };

  return (
    <LinearGradient colors={['#1C1C1C', '#2F2F2F']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.contentContainer}>
          <TextInput
            placeholder="Título do diário"
            placeholderTextColor={'#BFBFBF'}
            onChangeText={(text) => setTitulo(text)}
            style={styles.titulo}
          />
          <FlatList
            data={inputs}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Escreva aqui..."
                  placeholderTextColor="#BFBFBF"
                  onChangeText={(text) => handleInputChange(text, index)}
                  style={styles.input}
                  numberOfLines={21}
                  multiline={true}
                />
                <TouchableOpacity onPress={() => mandar(index)} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>{dados[index]?.valor ? 'adicionado' : mandar1 }</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.mainAddButton} onPress={addInput}>
            <Text style={styles.mainAddButtonText}>Adicionar Página</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.add} onPress={() => navigation.navigate('meuDiario')}>
            <Text style={styles.mainAddButtonText}>Salvar</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    backgroundColor: '#3C3C3C',
    borderRadius: 12,
    marginTop: 15,
    padding: 15,
  },
  input: {
    color: 'white',
    fontSize: 16,
    padding: 10,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#5A5A5A',
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    marginBottom: 10,
  },
  titulo: {
    borderWidth: 1,
    borderColor: '#5A5A5A',
    fontSize: 18,
    padding: 10,
    color: 'white',
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    marginBottom: 20,
  },
  saveButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  mainAddButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  mainAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  add: {
    backgroundColor: '#E94E77',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
});
