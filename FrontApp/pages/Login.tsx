import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import { useMutation } from "@apollo/client";
import { INICIO_SESION } from "../graphql/mutations/index";
import tw from 'twrnc';
import Spinner from 'react-native-loading-spinner-overlay'; 
import { clientUser } from '../graphql/apollo/apolloClient';
import * as SecureStore from 'expo-secure-store';

let toast: any;
if (Platform.OS === 'web') {
  toast = require('react-toastify').toast;
  require('react-toastify/dist/ReactToastify.css');
}

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [login, { loading }] = useMutation(INICIO_SESION, {client: clientUser});

  const handleLogin = async (email: string, pass: string) => {
    try {
      const { data } = await login({
        variables: { email, password: pass }
      });
      
      const { token, firstName, lastName, rut, role } = data.login;
      console.log('Datos de usuario:', { firstName, lastName, rut, email, pass, role });
  
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('userName', String(firstName));
      await SecureStore.setItemAsync('userLastName', String(lastName));
      await SecureStore.setItemAsync('userRut', String(rut));
      await SecureStore.setItemAsync('userEmail', String(email));
      await SecureStore.setItemAsync('userRole', String(role));
  
      Alert.alert('¡Éxito!', 'Inicio de Sesión correcto', [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('HomeLogin'),
        },
      ]);
    } catch (error: any) {
      console.error('Error completo:', error);
      Alert.alert('Error', error.message || 'Email o contraseña incorrectos');
    }
  };
  
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (email.trim() === '' || pass.trim() === '') {
      Alert.alert('Error', 'Por favor, llena ambos campos');
      return;
    }
    console.log('Email:', email, 'Password:', pass);
    event.preventDefault();
    handleLogin(email, pass);
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center bg-[#95D5B2]`}>
    <View style={tw`flex-1 bg-[#95D5B2] justify-center items-center`}>
      <Spinner visible={loading} textContent={'Cargando...'} textStyle={tw`text-white`} />
      
      <View style={tw`bg-[#1B4332] w-80 p-6 shadow-lg rounded-xl flex flex-col gap-4 justify-center`}>
        <Text style={tw`bg-[#1B4332] text-white text-center text-5xl font-bold py-4 rounded-xl`}>
        Colegio Bajos del Cerro Pequeño
      </Text>
        <Text style={tw`text-3xl text-white text-center underline font-semibold`}>Login</Text>

        <Text style={tw`text-white`}>Email:</Text>
        <TextInput
          style={tw`rounded-xl border w-full text-base px-3 py-2 bg-white`}
          placeholder="Ingresa tu Correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={tw`text-white mt-4`}>Contraseña:</Text>
        <TextInput
          style={tw`rounded-xl border w-full text-base px-3 py-2 bg-white`}
          placeholder="Ingresa tu Contraseña"
          value={pass}
          onChangeText={setPass}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
          <Text style={tw`text-white mt-2`}>
            Olvidé la contraseña. <Text style={tw`text-[#95D5B2]`}>Recuperar</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={handleSubmit}
        style={tw`bg-green-500 rounded-xl mt-4 text-2xl py-2 justify-center items-center`}
        disabled={loading}>
        <Text style={tw`text-white`}>{loading ? 'Cargando...' : 'Iniciar Sesión'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={tw`text-white mt-4`}>
            No tienes cuenta? <Text style={tw`text-[#95D5B2]`}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
        <Text style={tw`text-white mt-4`}>© CloseAI S.A., 2024. Todos los derechos reservados.</Text>
      </View>
    </View>
    </ScrollView>
  );
};

export default Login;
