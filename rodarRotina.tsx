import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

const { width, height } = Dimensions.get("window");

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
};

export default function gerarRotina() {
  const [nome, setNome] = useState<string>("");
  const [rotinas, setRotinas] = useState<string[]>([]);
  const route = useRoute<RouteProp<RootStackList, "gerar">>();
  const { id } = route.params;
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackList>>();
  const elemento = './assets2/pedra.png'

  const userName = async() => {
      const name = await AsyncStorage.getItem('userName')
      if (name){
          setNome(name)
      }
  }

  useFocusEffect(
      React.useCallback(()=>{
          userName()
      },[])
  )
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
  }, [isRunning]); // Dependência apenas de isRunning



  const init = () => {
      setIsRunning(true)
  }

  const receberRotinas = async () => {
    try {
      let reqs = await fetch("http://ec2-18-224-171-130.us-east-2.compute.amazonaws.com:3000/receberRotinas", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomeUser: nome, rotina: id }),
      });

      const response = await reqs.json();

      if (reqs.status === 200) {
        setRotinas(response.resultado);
        console.log(rotinas);
      } else {
        return;
      }
    } catch (error) {
      console.error("Erro no receberRotinas: " + error);
    }
  };

  useEffect(() => {
    if (nome) {
      receberRotinas();
    }
  }, [nome]);

  const stop = () => {
    setIsRunning(false)
  }

  return (
    <LinearGradient
      colors={["#1C1C1C", "#363636"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView>
      <TouchableOpacity onPress={()=>navigation.navigate('explore',{screen: 'Profile'})} ><Ionicons name='arrow-back-circle-outline' size={43} style={{right: width * 0.33, top: height * 0.02}} color={'white'}/></TouchableOpacity>
        <ScrollView>
        <View style={styles.contentContainer}>

          <FlatList
            data={rotinas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.text}>{item}</Text>
              </View>
            )}
            style={styles.flat}
          />
          <Image
            source={
              minutes >= 25 && minutes <= 49
                ? require('./assets2/ouro.png')
                : minutes >= 50 && hours === 2
                ? require('./assets2/ouro.png')
                : hours === 2 && minutes >= 1 && hours <= 7 && minutes <= 59
                ? require('./assets2/esmeralda.png')
                : hours >= 8 
                ? require('./assets2/diamante.png')
                : require('./assets2/pedra.png')
            }
            style={[
              styles.image,
              { marginTop: rotinas.length > 0 ? height * 0.03 : height * 0.2 },
            ]}
          />
        </View>
        </ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'center', left: width * 0.085}} >
            <Text style={{color: 'white', left: '2%', fontSize: width * 0.06}} >{hours}</Text>
            <Text style={{color: 'white', left: '50%',
              fontSize: width * 0.06}} >{minutes}</Text>
            <Text style={{color: 'white', left: '98%', fontSize: width * 0.06}} >{seconds}</Text>
        </View>
        <TouchableOpacity style={styles.executar} onPress={() => isRunning ? stop : init}>
            <Text style={{color: 'white', fontSize: width * 0.05}} >{ isRunning ? 'Parar' : 'Executar' }</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  flat: {
    flexGrow: 0,
    marginBottom: height * 0.01,
    top: height * 0.025
  },
  text: {
    color: "white",
    fontSize: width * 0.06,
  },
  image: {
    width: width * 0.22,
    height: height * 0.22,
  },
  executar: {
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
