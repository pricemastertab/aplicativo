import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient'
import { useRoute, RouteProp } from "@react-navigation/native";

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

export default function myRotina1(){
    const route = useRoute<RouteProp<RootStackList, 'minhaRotina2'>>()
    const { id, name } = route.params;
    console.log(id, name)

    return (
        <LinearGradient colors={['#1C1C1C', '#363636']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={styles.container} >
            <SafeAreaView></SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})