import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';
import 'expo-dev-client';
import { InterstitialAd, AdEventType, TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const { width, height } = Dimensions.get('window');

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

export default function User() {
    const [nomeSalvo, setNomeSalvo] = useState<string>('');
    const navigation = useNavigation<StackNavigationProp<RootStackList, "explore">>();
    const [teste, setTeste] = useState<string>('');

    const mandar = async () => {
        let a = await AsyncStorage.setItem('lastRoute', 'profile');
        let ab = await AsyncStorage.getItem('lastRoute');
        if (ab) {
            setTeste(ab);
            console.log(teste);
        }
    };

    useFocusEffect(
        useCallback(() => {
            mandar();
        }, [])
    );

    const receber = async () => {
        const name = await AsyncStorage.getItem('userName');
        if (name) setNomeSalvo(name);
    };

    useFocusEffect(
        useCallback(() => {
            receber();
        }, [])
    );

    return (
        <LinearGradient colors={['#1C1C1C', '#363636']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={styles.container}>
            <SafeAreaView style={{ flex: 1, width: '100%' }}>
                <View style={styles.header}>
                    <Text style={styles.greetingText}>Bem-vindo, <Text style={styles.name}>{nomeSalvo}</Text>!</Text>
                    <Text style={styles.subText}>Selecione uma das opções abaixo para começar.</Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('dinheiro')}>
                        <Text style={styles.optionTitle}>💰 Organizar Dinheiro</Text>
                        <Text style={styles.optionDescription}>Gerencie suas finanças de forma simples e prática.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('selectDiario')}>
                        <Text style={styles.optionTitle}>📋 Minhas Rotinas</Text>
                        <Text style={styles.optionDescription}>Visualize e gerencie suas rotinas diárias.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('meuDiario')}>
                        <Text style={styles.optionTitle}>📖 Meus Diários</Text>
                        <Text style={styles.optionDescription}>Acesse suas anotações pessoais e reflexões.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('cronometro')}>
                        <Text style={styles.optionTitle}>⏰ Cronômetro BrainGen</Text>
                        <Text style={styles.optionDescription}>Ganhe medalhas quanto maior o tempo de foco.</Text>
                    </TouchableOpacity>
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        requestOptions={{
                            networkExtras: {
                            collapsible: 'bottom',
                            },
                        }}
                        />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        alignItems: 'center',
        marginTop: height * 0.1,
        marginBottom: height * 0.05,
    },
    greetingText: {
        fontSize: width * 0.07,
        color: 'white',
        fontWeight: 'bold',
    },
    name: {
        color: '#FFD700',
    },
    subText: {
        color: '#CCCCCC',
        fontSize: width * 0.045,
        textAlign: 'center',
        marginTop: height * 0.01,
    },
    optionsContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
    },
    optionCard: {
        backgroundColor: '#444444',
        padding: height * 0.02,
        borderRadius: 15,
        marginVertical: height * 0.015,
    },
    optionTitle: {
        color: '#FFD700',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    optionDescription: {
        color: '#CCCCCC',
        fontSize: width * 0.04,
        marginTop: height * 0.005,
    },
});
