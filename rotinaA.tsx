import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'; // Import CheckBox component
import { useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import {Checkbox} from 'expo-checkbox'

type Tarefa = {
    texto: string;
    adicionada: boolean;
    checked: boolean; // Add checked property to manage the checkbox state
};

const { width, height } = Dimensions.get('window');

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
    rotinas2: { id: string, titulo: string };
    gerar: { id: string };
};

type boo = {
    valor: boolean;
}

export default function Exa() {
    const route = useRoute<RouteProp<RootStackList, 'rotinas2'>>();
    const [nome, setNome] = useState<string>('');
    const [rotinas, setRotinas] = useState<string[]>([]);
    const [valor, setValor] = useState<boolean>(true);
    const { id, titulo } = route.params;
    const navigation = useNavigation<StackNavigationProp<RootStackList>>();
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [isChecked, setChecked] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [nova, setNova] = useState<Tarefa[]>([]); // Initialize nova with checked state
    const [value, setValue] = useState<boolean>(true);
    const [nomeSalvo, setNomeSalvo] = useState<string>('');
    const [status, setStatus] = useState<string>('')
    const [rotinasAntiga, setRotinaAntiga] = useState<string[]>([])
    const [checkedState, setCheckedState] = useState<boolean[]>(nova.map(() => false)); // Estado para cada checkbox, inicializado com "false" para todos
    const [views, setViews] = useState<boo[]>([])
    const [ids,setIds] = useState<string[]>([])

    const toggleCheckbox = (index: number) => {
        const newCheckedState = [...checkedState];  // Copia o estado atual
        newCheckedState[index] = !newCheckedState[index];  // Alterna o valor do checkbox no índice correspondente
        setCheckedState(newCheckedState);  // Atualiza o estado
    };
    

    const executar = async() => {
        await AsyncStorage.setItem('status', 'executar')
    }
    executar()

    const useName = async () => {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
            setNomeSalvo(name);
        }
    };
    
    useEffect(()=>{
        const interv = setInterval(()=>{
            const rodar = async() => {
                const stat = await AsyncStorage.getItem('status')
                if (stat){
                    setStatus(stat)
                }
            }
            rodar()
        },2500)
        return () => clearInterval(interv)
    })

    const handleRotinas = (index: number, text: string) => {
        const update = [...rotinasAntiga]
        update[index] = text
        setRotinaAntiga(update)
    }

    useFocusEffect(
        React.useCallback(() => {
            useName();
        }, [])
    );

    const enviarTarefa = async (index: number) => {
        const tarefa = nova[index].texto;
        try {
            const response = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/mandarPubli', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ tarefa: tarefa, nameUser: nomeSalvo, idUser: id, titulo: titulo }),
            });

            console.log('nome: ' + nomeSalvo + 'tarefa: ' + tarefa);

            if (response.ok) {
                const newInputs = [...nova];
                newInputs[index].adicionada = true;
                setNova(newInputs);
            } else {
                alert('Erro ao enviar a tarefa.');
                console.error('Erro:' + response.statusText);
            }
        } catch (error) {
            console.error("Erro ao enviar a tarefa:", error);
            alert('Erro ao enviar a tarefa.');
        }
    };

    const userName = async () => {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
            setNome(name);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            userName();
        }, [])
    );

    const toggleValue = (index: number) => {
        setViews((prev) => {
            const updatedViews = [...prev];
            if (updatedViews[index]) {
                updatedViews[index].valor = !updatedViews[index].valor;
            }
            return updatedViews;
        });
    };
    

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => {
                    if (prev === 59) {
                        setMinutes((min) => {
                            if (min === 59) {
                                setHours((hr) => hr + 1);
                                return 0;
                            }
                            return min + 1;
                        });
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning]);

    const init = () => {
        setIsRunning(true);
    };

    const addInput = () => {
        setNova((prevInput) => [...prevInput, { texto: "", adicionada: false, checked: false }]); // Add checked state
    };

    const handleInputChange = (text: string, index: number) => {
        const newInput = [...nova];
        newInput[index].texto = text;
        setNova(newInput);
    };

    const receberRotinas = async () => {
        try {
            let reqs = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberRotinas', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nomeUser: nome, rotina: id })
            });

            const response = await reqs.json();

            if (reqs.status === 200) {
                setRotinas(response.resultado);
                console.log(rotinas);
                setViews((prevState) => [...prevState, {valor: false}])
            } else {
                return;
            }
        } catch (error) {
            console.error('Erro no receberRotinas: ' + error);
        }
    };

    const receberRotinasAntiga = async () => {
        try {
            let reqs = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberRotinas', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nomeUser: nome, rotina: id })
            });

            const response = await reqs.json();

            if (reqs.status === 200) {
                setRotinaAntiga(response.resultado);
                setIds(response.resultado2)
            } else {
                return;
            }
        } catch (error) {
            console.error('Erro no receberRotinas: ' + error);
        }
    };

    const deletarRotina = async(index: number) => {
        try{
            console.log('executar')
            let reqs6 = await fetch ('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/deletarInfo',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nameUser: nomeSalvo, valorUser: ids[index]})
            })

            if (reqs6.status === 200){
                setRotinas((prev) => prev.filter((_, i) => i !== index))
            } else {
                Alert.alert('Erro ao deletar')
            }
        } catch (error){
            console.error('Erro no deletarRotina: ' + error)
        }
    }

    useEffect(() => {
        const interval = setInterval(()=>{
            receberRotinas()
        },2500)
        return () => clearInterval(interval)
    }, [nome]);

    return (
        <LinearGradient colors={['#1C1C1C', '#363636']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.voltar} onPress={() => navigation.navigate('explore', { screen: 'Profile' })}>
                        <Ionicons name="arrow-back-circle-outline" size={43} color={'#F5F5F5'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.usar} >
                        <Text style={styles.usarText}>Usar essa rotina</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={rotinas}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={{ 
                            flexDirection: 'row', 
                            backgroundColor: '#455A64', 
                            padding: 15, 
                            borderRadius: 7, 
                            marginBottom: 15 
                        }}>
                            <TextInput
                                placeholder="Digite a rotina"
                                value={item || ''}
                                onChangeText={(text) => handleRotinas(index, text)}
                                placeholderTextColor={'white'}
                                style={{ flex: 1, color: 'white' }}
                            />
                            <Checkbox
                                style={styles.checkbox}
                                value={checkedState[index]}
                                onValueChange={() => toggleCheckbox(index)}
                                color={checkedState[index] ? '#4630EB' : undefined}
                            />
                            <View style={{flexDirection: 'row'}} >
                                <TouchableOpacity onPress={() => toggleValue(index)} ><Text style={{color: 'white', fontSize: 18}} >...</Text></TouchableOpacity>
                                {
                                    views[index]?.valor ? (
                                        <TouchableOpacity onPress={() => deletarRotina(index)} >
                                            <Text style={{color: 'red'}} >excluir</Text>
                                        </TouchableOpacity>
                                    ) : null
                                }
                            </View>
                        </View>
                    )}
                    style={styles.flat}
                />

                <View style={{ flex: 1, height: '200%' }}>
                    <FlatList
                        data={nova}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                        <View style={styles.inputContainer}>
                            {item.adicionada ? null : (
                            <>
                                <TextInput
                                placeholder={`Tarefa ${index + 1}`}
                                placeholderTextColor={'#B0BEC5'}
                                value={item.texto}
                                onChangeText={(text) => handleInputChange(text, index)}
                                style={styles.input}
                                />
                                <TouchableOpacity 
                                style={[styles.addButton, item.adicionada && styles.addedButton]} 
                                disabled={item.adicionada} 
                                onPress={() => enviarTarefa(index)}
                                >
                                <Text style={styles.addButtonText}>
                                    {item.adicionada ? 'Adicionado' : 'Adicionar'}
                                </Text>
                                </TouchableOpacity>
                            </>
                            )}
                        </View>
                        )}
                        style={[styles.flatInputs, { flex: 0, bottom: height * 0.2 }]} // FlatList fixo
                    />
                    </View>

                <TouchableOpacity style={styles.addInputButton} onPress={addInput}>
                    <Text style={styles.addInputButtonText}>Adicionar</Text>
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
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 16,
    },
    voltar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    usar: {
        backgroundColor: '#1E88E5',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    usarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    flat: {
        flex: 1,
        marginVertical: 10,
    },
    flatText: {
        fontSize: 16,
        color: '#ECEFF1',
    },
    flatInputs: { 
        paddingHorizontal: 2, 
        marginTop: height * 0.13,
      },
    inputContainer: {
        flexDirection: 'row',   // This ensures elements are displayed in a row (side by side)
        alignItems: 'center',   // Centers vertically
        marginVertical: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#CFD8DC',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: '#37474F',
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#43A047',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    addedButton: {
        backgroundColor: '#1B5E20',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    addInputButton: {
        backgroundColor: '#0288D1',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    addInputButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    checkbox: {
        marginLeft: 4,   // Adds space between the button and checkbox
        right: width * 0.05
    }
});
