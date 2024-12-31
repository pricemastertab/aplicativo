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
      <Tab.Screen name="Feed" component={TabTwoScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function MyStack() {
  const [route, setRoute] = useState<string | null>(null);

  const receber = async () => {
    const name = await AsyncStorage.getItem('lastRoute');
    if (name) {
      setRoute(name);
    }
  };

  useEffect(() => {
    receber();
  }, []);

  if (route === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
//route || 'Home'
  return (
    <Stack.Navigator initialRouteName={route === 'profile' ? 'explore' : 'Home'}>
      <Stack.Screen name="Home" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="explore" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Rotina' component={RotinaScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='diario' component={diarioScreen} options={{headerShown: false}}/>
      <Stack.Screen name='meuDiario' component={myDiarioScreen} options={{headerShown: false}}/>
      <Stack.Screen name='meusDiarios' component={meusDiarios} options={{headerShown: false}}/>
      <Stack.Screen name='selectDiario' component={SelectRotina} options={{headerShown: false}}/>
      <Stack.Screen name='minhaRotina2' component={myRotina1} options={{headerShown: false}}/>
      <Stack.Screen name='rotinas2' component={Exa} options={{headerShown: false}}/>
      <Stack.Screen name='gerar' component={gerarRotina} options={{headerShown: false}}/>
      <Stack.Screen name='dinheiro' component={dinheiroScreen} options={{headerShown: false}}/>
      <Stack.Screen name='divisao' component={divisionScreen} options={{headerShown: false}}/>
      <Stack.Screen name='receberMoney' component={receberDinheiro} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

export default MyStack;
