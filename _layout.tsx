import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabTwoScreen from './explore';
import RegisterScreen from './Register';
import User from './User';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Sem chaves
import RotinaScreen from './Rotina';
import diarioScreen from './diario';
import myRotina1 from './minhasRotinas2';
import myDiarioScreen from './meuDiario';
import meusDiarios from './meusDiarios';
import SelectRotina from './selecionadorDeRotinas';
import Exa from './rotinaA';
import gerarRotina from './rodarRotina';
import dinheiroScreen from './dinheiro';
import divisionScreen from './dividirDinheiro';
import receberDinheiro from './receberDinheiro';
import configScreen from './config';
import alterNameScreen from './alterName';
import alterSenhaScreen from './alterSenha';
import sobreAppScreen from './sobreApp';
import cronometroScreen from './cronometro';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName='Profile'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else {
            iconName = 'home-outline'; // Um ícone padrão caso não corresponda a nenhum caso
          }

          return <Ionicons name='person-circle-outline' size={size || 24} color={color || 'black'} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#212121',
        tabBarInactiveBackgroundColor: '#040524',
      })}
    >
      <Tab.Screen name="Profile" component={User} options={{ headerShown: false }} />
      <Tab.Screen name="configurações" component={configScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function MyStack() {
  const [route, setRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLastRoute = async () => {
      try {
        const lastRoute = await AsyncStorage.getItem('last');
        setRoute(lastRoute); // Define a rota salva ou null se não houver
        console.log(route)
      } catch (error) {
        console.error('Erro ao buscar rota do AsyncStorage:', error);
      } finally {
        setLoading(false); // Para de exibir o indicador de carregamento
      }
    };

    checkLastRoute();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={route === 'profile' ? 'explore' : 'Home'}>
      <Stack.Screen name="Home" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="explore" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Rotina" component={RotinaScreen} options={{ headerShown: false }} />
      <Stack.Screen name="diario" component={diarioScreen} options={{ headerShown: false }} />
      <Stack.Screen name="meuDiario" component={myDiarioScreen} options={{ headerShown: false }} />
      <Stack.Screen name="meusDiarios" component={meusDiarios} options={{ headerShown: false }} />
      <Stack.Screen name="selectDiario" component={SelectRotina} options={{ headerShown: false }} />
      <Stack.Screen name="minhaRotina2" component={myRotina1} options={{ headerShown: false }} />
      <Stack.Screen name="rotinas2" component={Exa} options={{ headerShown: false }} />
      <Stack.Screen name="gerar" component={gerarRotina} options={{ headerShown: false }} />
      <Stack.Screen name="dinheiro" component={dinheiroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="divisao" component={divisionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="receberMoney" component={receberDinheiro} options={{ headerShown: false }} />
      <Stack.Screen name="alterName" component={alterNameScreen} options={{ headerShown: false }} />
      <Stack.Screen name="alterSenha" component={alterSenhaScreen} options={{ headerShown: false }} />
      <Stack.Screen name="sobre" component={sobreAppScreen} options={{ headerShown: false }} />
      <Stack.Screen name="cronometro" component={cronometroScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default MyStack;

