import React, { useEffect, useState } from "react";
import { 
    View, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    FlatList, 
    Text, 
    Dimensions,
    Alert
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

type Tarefa = {
    texto: string;
    adicionada: boolean;
};

type RootStackList = {
    Home: undefined;
    explore: { screen: string };
    Register: undefined;
    Rotina: undefined;
    diario: { id: number };
    minhaRotina2: { id: string, name: string };
    meuDiario: undefined;
    meusDiarios: { id: string, dado: string };
    selectDiario: undefined;
};

export default function RotinaScreen() {
    const [inputs, setInputs] = useState<Tarefa[]>([]);
    const route = useRoute<RouteProp<RootStackList, 'Rotina'>>();
    const [id, setId] = useState<number>(0);
    const [nomeSalvo, setNomeSalvo] = useState<string>('');
    const navigation = useNavigation<StackNavigationProp<RootStackList>>();
    const [titulo, setTitulo] = useState<string>('');
    const [idUsado, setIdUsado] = useState<number>(0)
    const [value, setValue] = useState<boolean>(true)

    const routeName = async () => {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
            setNomeSalvo(name);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            routeName();
        }, [])
    );

    const addInput = () => {
        setInputs((prevInputs) => [...prevInputs, { texto: "", adicionada: false }]);
    };

    const handleInputChange = (text: string, index: number) => {
        const newInputs = [...inputs];
        newInputs[index].texto = text;
        setInputs(newInputs);
    };

    useEffect(() => {
        if (value) {
            receberIds();
        }
    }, [value]);
    
    const receberIds = async () => {
        try {
            const reqs3 = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberId', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
    
            const respons = await reqs3.json();
    
            if (reqs3.status === 200) {
                setId(respons.dado);
    
                // Só atualize `idUsado` se estiver no valor inicial
                if (idUsado === 0) {
                    setIdUsado(respons.dado);
                }
    
                // Depois de buscar o ID, desative a busca repetida
                setValue(false);
            } else {
                console.error('Erro ao buscar ID: ', reqs3.statusText);
                setValue(false);
            }
        } catch (error) {
            console.error('Erro no receberIds: ' + error);
        }
    };
    

    console.log(id)

    const enviarTarefa = async (index: number) => {
        const tarefa = inputs[index].texto;
        try {
            if (!titulo || !tarefa) {
                Alert.alert('Preencha todos os campos antes de adicionar.');
                return;
            }
    
            const idParaUsar = idUsado || id; // Use idUsado, mas se for 0, use id
    
            const response = await fetch('http://192.168.0.112:3000/mandarPubli', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    tarefa: tarefa,
                    nameUser: nomeSalvo,
                    idUser: idUsado === 0 ? 1 : idUsado,
                    titulo: titulo,
                }),
            });
    
            if (response.ok) {
                const newInputs = [...inputs];
                newInputs[index].adicionada = true;
                setInputs(newInputs);
            } else {
                alert('Erro ao enviar a tarefa.');
                console.error('Erro:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar a tarefa:', error);
            alert('Erro ao enviar a tarefa.');
        }
    };
    

    return (
        <LinearGradient
            colors={["#1C1C1C", "#363636"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity style={{right: width * 0.4, top: height * 0.02}} onPress={()=>navigation.navigate('selectDiario')}>
                    <Ionicons name="arrow-back-circle-outline" size={43} color={'white'}/>
                </TouchableOpacity>
                <Text style={styles.title}>Crie sua rotina</Text>
                <TextInput
                    placeholder="Título da Rotina"
                    placeholderTextColor={'#94A3B8'}
                    style={styles.titleInput}
                    onChangeText={(text) => setTitulo(text)}
                />

                <FlatList
                    data={inputs}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={`Tarefa ${index + 1}`}
                                placeholderTextColor={'#94A3B8'}
                                value={item.texto}
                                onChangeText={(text) => handleInputChange(text, index)}
                                style={styles.input}
                            />
                            <TouchableOpacity
                                onPress={() => enviarTarefa(index)}
                                style={[styles.addButton, item.adicionada && styles.disabledButton]}
                                disabled={item.adicionada}
                            >
                                <Text style={styles.addButtonText}>
                                    {item.adicionada ? "Adicionado" : "Adicionar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />

                <TouchableOpacity onPress={addInput} style={styles.mainAddButton}>
                    <Text style={styles.mainAddButtonText}>Adicionar Tarefa</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('selectDiario')} 
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Salvar</Text>
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
        alignItems: 'center',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        color: '#E2E8F0',
        fontWeight: 'bold',
        marginBottom: 25,
        bottom: height * 0.02
    },
    titleInput: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#94A3B8',
        backgroundColor: '#1E293B',
        color: '#E2E8F0',
        width: width * 0.8,
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: width * 0.9,
    },
    input: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#94A3B8',
        backgroundColor: '#334155',
        color: '#E2E8F0',
        width: '70%',
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#6B7280',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    mainAddButton: {
        backgroundColor: '#2563EB',
        padding: 15,
        borderRadius: 8,
        marginVertical: 20,
    },
    mainAddButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#10B981',
        padding: 15,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
