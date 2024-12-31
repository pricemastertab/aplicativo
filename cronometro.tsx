import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";

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

export default function CronometroScreen() {
    const [seconds, setSeconds] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [exec, setExec] = useState<boolean>(false);
    const navigation = useNavigation<StackNavigationProp<RootStackList, "cronometro">>()

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (exec) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    if (prev + 1 === 60) {
                        setMinutes((prevMinutes) => {
                            if (prevMinutes + 1 === 60) {
                                setHours((prevHours) => prevHours + 1);
                                return 0;
                            }
                            return prevMinutes + 1;
                        });
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else if (!exec && interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [exec]);

    const getImageSource = () => {
        if (minutes >= 20 && minutes <= 59) {
            return require('./assets2/ouro.png');
        } else if ((minutes >= 0 && hours === 1) || (hours === 1 && minutes <= 39)) {
            return require('./assets2/esmeralda.png');
        } else if (hours > 1 || (hours === 1 && minutes > 40)) {
            return require('./assets2/diamante.png');
        } else {
            return require('./assets2/pedra.png');
        }
    };

    const imageSource = getImageSource();

    return (
        <LinearGradient colors={["#1C1C1C", "#363636"]} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity style={{right: width * 0.4}} onPress={() => navigation.navigate('explore',{screen: 'Profile'})}>
                    <Ionicons name="arrow-back-circle-outline" size={40} color={'white'}/>
                </TouchableOpacity>
                <Text style={styles.title}>Cronômetro</Text>
                <Text style={{color: 'white', fontWeight: 'bold'}} >20 minutos - 59 minutos: <Text style={{color: 'yellow'}} >medalha de ouro</Text></Text>
                <Text style={{color: 'white', fontWeight: 'bold'}} >1 horas - 1 hora e 39 minutos: <Text style={{color: 'green'}} >medalha de esmeralda</Text></Text>
                <Text style={{color: 'white', fontWeight: 'bold'}} >1 hora e 40 minutos ou mais: <Text style={{color: 'blue'
                    }} >medalha de diamante</Text></Text>
                <View style={styles.timerContainer}>
                    <Text style={styles.time}>{String(hours).padStart(2, '0')}</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.time}>{String(minutes).padStart(2, '0')}</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.time}>{String(seconds).padStart(2, '0')}</Text>
                </View>
                {imageSource && <Image source={imageSource} style={styles.image} />}
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={() => setExec(true)}>
                        <Text style={styles.buttonText}>Iniciar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setExec(false)}>
                        <Text style={styles.buttonText}>Pausar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { setExec(false); setSeconds(0); setMinutes(0); setHours(0); }}>
                        <Text style={styles.buttonText}>Resetar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: height * 0.05,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.05,
    },
    time: {
        fontSize: width * 0.1,
        fontWeight: 'bold',
        color: 'white',
    },
    colon: {
        fontSize: width * 0.1,
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 5,
    },
    image: {
        width: width * 0.45,
        height: height * 0.45,
        resizeMode: 'contain',
        marginBottom: height * 0.05,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    button: {
        backgroundColor: '#444',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: width * 0.05,
        color: 'white',
        fontWeight: 'bold',
    },
});
