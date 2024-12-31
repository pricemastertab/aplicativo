import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

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

export default function MyDiarioScreen() {
  const [ids, setIDs] = useState<string[]>([]);
  const [nome, setNome] = useState<string>('');
  const [name, setName] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Indicador de carregamento
  const navigation = useNavigation<StackNavigationProp<RootStackList>>();
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [nomeSalvo, setNomeSalvo] = useState<string>('')
  
  const toggleView = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setNome(storedName);
        const reqs = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberDiario', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nameUser: storedName }),
        });

        const response = await reqs.json();

        if (reqs.status === 200) {
          setIDs(response.id || []);
          setName(response.idade || []);
        } else {
          console.error('Resposta inesperada da API');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(()=>{
      carregarDados();
    },[])
  )

  const receber3 = async () => {
    try {
      let reqs = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberId', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const response = await reqs.json();
      const data = reqs.status === 200 ? Number(response.dado) + 1 : 1000;
      navigation.navigate('diario', { id: data });
    } catch (error) {
      console.error('Erro na função receber3:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('explore', { screen: 'Profile' })}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-circle-outline" size={45} color={'white'} />
      </TouchableOpacity>
      <Text style={styles.title}>Seus Diários</Text>
    </View>
  );

  const userName = async() => {
    const namber = await AsyncStorage.getItem('userName')
    if (namber){
      setNomeSalvo(namber)
    }
  }

  useFocusEffect(
    React.useCallback(()=>{
      userName()
    },[])
  )

  const deleteFlat = async (id: string) => {
    try {
        let reqs4 = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/delete', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nomeUser: nomeSalvo, idUser: id }),
        });

        if (reqs4.status === 200) {
            setVisibleIndex(null);
            setName((prev) => prev.filter((_, i) => i !== visibleIndex));
            setIDs((prev) => prev.filter((_,i) => i !== visibleIndex))
        } else {
            console.error('Erro na exclusão do item.');
        }
    } catch (error) {
        console.error('Erro no deleteFlat: ' + error);
    }
  };

  const renderEmpty = () => (
    <Text style={styles.emptyText}>Nenhum diário encontrado</Text>
  );

  return (
    <LinearGradient
      colors={['#1C1C1C', '#363636']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <TouchableOpacity style={styles.createButton} onPress={receber3}>
          <Text style={styles.createButtonText}>Criar um diário</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
        ) : (
          <FlatList
            data={ids}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('meusDiarios', {
                      id: item,
                      dado: name[index]?.slice(7) || 'Sem título',
                    })
                  }
                  style={{ alignItems: 'center' }}
                >
                  <Text style={styles.itemText}>📖 {name[index]?.slice(7)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.expandButton} onPress={() => toggleView(index)}>
                  <Text style={styles.expandText}>...</Text>
                </TouchableOpacity>
                {visibleIndex === index && (
                  <TouchableOpacity
                    onPress={() => deleteFlat(ids[index])}
                    style={styles.deleteButtonSmall}
                  >
                    <Text style={styles.deleteTextSmall}>Excluir</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={renderEmpty()}
            style={styles.flatList}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1, width: '100%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: height * 0.05,
  },
  backButton: { alignSelf: 'flex-start' },
  title: { color: 'white', fontSize: 30, fontWeight: 'bold', right: width * 0.23 },
  createButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: height * 0.05,
  },
  createButtonText: { color: 'white', fontSize: width * 0.05 },
  loader: { marginTop: height * 0.2 },
  flatList: { flexGrow: 1, marginTop: 20, padding: 7 },
  itemContainer: {
    backgroundColor: '#1A1A1A',
    padding: height * 0.02,
    borderRadius: 15,
    marginVertical: height * 0.015,
    marginHorizontal: 20,
  },
  itemText: { color: 'white', fontSize: 18 },
  emptyText: { color: 'gray', textAlign: 'center', marginTop: 20, fontSize: 16 },
  expandButton: {
    position: 'absolute',
    top: height * 0.001, // Distância ajustada para o botão de três pontinhos
    right: width * 0.04,
  },
  expandText: {
      color: 'white',
      fontSize: width * 0.06,
  },
  expandedContainer: {
      backgroundColor: '#2C2C2C',
      padding: height * 0.015, // Mais padding para evitar que o texto fique apertado
      borderRadius: 8,
      marginTop: height * 0.01,
      alignSelf: 'flex-start', // Garante que o botão fique alinhado ao início
      width: width * 0.8, // Ajusta o tamanho do contêiner expandido
  },
  deleteText: {
      color: 'red',
      fontSize: width * 0.045,
      fontWeight: 'bold',
  },
  deleteButton: {
      alignSelf: 'center',
      marginTop: height * 0.01,
  },
  deleteButtonSmall: {
    position: 'absolute', // Para alinhar o botão diretamente
    top: height * 0.04, // Ajusta a posição para logo abaixo dos três pontinhos
    right: width * 0.04, // Alinha com o botão "..."
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 5,
  },
  deleteTextSmall: {
    color: 'red',
    fontSize: width * 0.04,
    textAlign: 'center'
  }
});
