import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";

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
  };

const { width, height } = Dimensions.get("window");

export default function SobreAppScreen() {
  const [nomeSalvo, setNomeSalvo] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackList, "sobre">>()

  const userName = async () => {
    const name = await AsyncStorage.getItem("userName");
    if (name) {
      setNomeSalvo(name);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      userName();
    }, [])
  );

  return (
    <LinearGradient
      colors={["#1C1C1C", "#363636"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity onPress={() => navigation.navigate('explore',{screen: 'configurações'})} >
            <Ionicons name="arrow-back-circle-outline" size={43} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.title}>Sobre o App</Text>
          <Text style={styles.paragraph}>
            Olá{" "}
            <Text style={{ color: "#FFA726", fontWeight: "bold" }}>
              {nomeSalvo}
            </Text>
            , seja bem-vindo ao{" "}
            <Text style={{ color: "#FFA726", fontWeight: "bold" }}>
              BrainGen
            </Text>
            , o aplicativo definitivo para a sua produtividade!
          </Text>

          <Text style={styles.paragraph}>
            Com o BrainGen, você tem em mãos uma poderosa ferramenta para
            organizar sua vida de forma prática e eficiente. Aqui, você pode:
          </Text>

          <View style={styles.featureContainer}>
            <Text style={styles.featureTitle}>• Criar Rotinas Personalizadas</Text>
            <Text style={styles.featureText}>
              Planeje seu dia, sua semana ou até mesmo sua vida com rotinas que
              se adaptam ao seu estilo e necessidades.
            </Text>
          </View>

          <View style={styles.featureContainer}>
            <Text style={styles.featureTitle}>• Gerenciar Finanças com Facilidade</Text>
            <Text style={styles.featureText}>
              Controle seus gastos, acompanhe suas economias e atinja seus
              objetivos financeiros com organização e clareza.
            </Text>
          </View>

          <View style={styles.featureContainer}>
            <Text style={styles.featureTitle}>• Registrar seus Momentos em Diários</Text>
            <Text style={styles.featureText}>
              Expresse suas ideias, sentimentos e experiências, mantendo um
              registro pessoal que evolui com você.
            </Text>
          </View>

          <View style={styles.featureContainer}>
            <Text style={styles.featureTitle}>
              • Ganhar Medalhas de Foco com o Cronômetro BrainGen
            </Text>
            <Text style={styles.featureText}>
              A cada sessão de foco, você acumula tempo valioso que se
              transforma em medalhas exclusivas. Quanto mais tempo dedicado,
              maior o valor da sua conquista!
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Além disso, o BrainGen oferece um ambiente intuitivo e motivador,
            incentivando você a alcançar metas e transformar sua rotina.
            Descubra como pequenos hábitos podem gerar grandes mudanças na sua
            produtividade e bem-estar.
          </Text>

          <Text style={styles.callToAction}>
            Comece agora mesmo e seja a melhor versão de você! 😊
          </Text>
        </ScrollView>
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
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  scrollView: {
    paddingBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#FFA726",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  paragraph: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
    marginBottom: height * 0.02,
    lineHeight: height * 0.03,
    textAlign: "justify",
  },
  featureContainer: {
    marginBottom: height * 0.03,
    backgroundColor: "#2E2E2E",
    borderRadius: 8,
    padding: 12,
  },
  featureTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#FFA726",
    marginBottom: 6,
  },
  featureText: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
    lineHeight: height * 0.025,
  },
  callToAction: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#FFA726",
    textAlign: "center",
    marginTop: height * 0.03,
  },
});
