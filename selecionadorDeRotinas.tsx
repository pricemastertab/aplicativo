import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Dimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
    rotinas2: { id: string, titulo: string };
};

export default function SelectRotina() {
    const [nomeSalvo, setNomeSalvo] = useState<string>('');
    const [rotina, setRotina] = useState<string[]>([]);
    const navigation = useNavigation<StackNavigationProp<RootStackList>>();
    const [ids, setIds] = useState<string[]>([]);
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

    const toggleView = (index: number) => {
        setVisibleIndex(visibleIndex === index ? null : index);
    };

    const userName = async () => {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
            setNomeSalvo(name);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            userName();
        }, [])
    );

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
                setRotina((prev) => prev.filter((_, i) => i !== visibleIndex));
                setIds((prev) => prev.filter((_, i) => i !== visibleIndex));
                setVisibleIndex(null);
            } else {
                console.error('Erro na exclusão do item.');
            }
        } catch (error) {
            console.error('Erro no deleteFlat: ' + error);
        }
    };

    const receberRotinas = async () => {
        try {
            let reqs = await fetch('http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberRoti', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nameUser: nomeSalvo }),
            });

            const response = await reqs.json();

            if (reqs.status === 200) {
                setRotina(response.rotina || []);
                setIds(response.image || []);
            } else {
                console.error('Erro no servidor: ', reqs.status);
            }
        } catch (error) {
            console.error('ERRO NO RECEBERROTINAS:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (nomeSalvo) {
                receberRotinas();
            }
        }, [nomeSalvo])
    );
    console.log(rotina.length)

    return (
        <LinearGradient
            colors={['#1C1C1C', '#363636']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                {
                    rotina.length === 0 ? (<TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.navigate('explore', { screen: 'Profile' })}
                        >
                            <Ionicons name="arrow-back-circle-outline" size={45} color="white" />
                        </TouchableOpacity>
                    ):(
                        <TouchableOpacity
                            style={styles.backButton2}
                            onPress={() => navigation.navigate('explore', { screen: 'Profile' })}
                        >
                            <Ionicons name="arrow-back-circle-outline" size={45} color="white" />
                        </TouchableOpacity>
                    ) 
                }
                <Text style={styles.title}>Suas Rotinas</Text>
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('Rotina')}>
                    <Text style={styles.createButtonText}>Criar uma rotina</Text>
                </TouchableOpacity>
                <View style={styles.listContainer}>
                    {rotina.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhuma rotina encontrada.</Text>
                    ) : (
                        <FlatList
                            data={rotina}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View
                                    style={[
                                        styles.itemContainer,
                                        visibleIndex === index && styles.expandedItemContainer,
                                    ]}
                                >
                                    <View style={styles.centeredContent}>
                                        <TouchableOpacity
                                            style={styles.rotinas}
                                            onPress={() =>
                                                navigation.navigate('rotinas2', {
                                                    id: ids[index],
                                                    titulo: item.replace('Rotina:', ''),
                                                })
                                            }
                                        >
                                            <Text style={styles.itemText}>📋 {item.replace('Rotina:', '')}</Text>
                                        </TouchableOpacity>
                                    </View>
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
                            style={styles.flat}
                        />
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: height * 0.02, // Espaçamento extra para evitar que os itens fiquem colados no final
    },
    backButton: {
        position: 'absolute',
        top: height * 0.05,
        right: width * 0.6, // Define uma posição fixa
        zIndex: 1, // Garante que o botão fique sobre os outros elementos
    },
    listContainer: {
        flex: 1, // Garante que a FlatList ou o texto ocupe espaço disponível
        justifyContent: 'center', // Centraliza o conteúdo quando a lista está vazia
    },
    title: {
        fontSize: width * 0.07,
        color: 'white',
        fontWeight: 'bold',
        marginTop: height * 0.08,
        textAlign: 'center',
    },
    createButton: {
        marginTop: height * 0.03,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    createButtonText: {
        color: 'white',
        fontSize: width * 0.045,
    },
    emptyText: {
        color: 'white',
        fontSize: 16,
        marginBottom: height * 0.6, // Mais espaçamento para evitar que o texto fique colado
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#1A1A1A',
        padding: height * 0.015, // Aumentei o padding
        borderRadius: 15,
        marginVertical: height * 0.015,
        width: width * 0.85,
        alignSelf: 'center',
        position: 'relative',
        minHeight: height * 0.1, // Altura mínima ajustada para acomodar os elementos
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rotinas: {
        alignSelf: 'center', // Garante que o botão esteja centralizado
    },
    expandButton: {
        position: 'absolute',
        top: height * 0.02, // Distância ajustada para o botão de três pontinhos
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
    flat: {
        marginTop: height * 0.02,
    },
    itemText: {
        color: 'white',
        fontSize: width * 0.045,
    },
    deleteButtonSmall: {
        position: 'absolute', // Para alinhar o botão diretamente
        top: height * 0.06, // Ajusta a posição para logo abaixo dos três pontinhos
        right: width * 0.04, // Alinha com o botão "..."
        backgroundColor: '#2C2C2C',
        borderRadius: 5,
        padding: 5,
    },
    deleteTextSmall: {
        color: 'red',
        fontSize: width * 0.04,
        textAlign: 'center',
    },
    backButton2: {
        top: height * 0.05
    }
    
});
