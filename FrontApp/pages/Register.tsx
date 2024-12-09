import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useMutation } from "@apollo/client";
import { REGISTRO, CREAR_USUARIO } from "../graphql/mutations/index";
import { clientUser } from '../graphql/apollo/apolloClient';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Spinner from 'react-native-loading-spinner-overlay';
import { RootStackParamList } from './types';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';

type RegisterScreenProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [pass, setPass] = useState('');
  const [passVerifi, setPassVerifi] = useState('');
  const [register, { loading }] = useMutation(REGISTRO, { client: clientUser });

  const navigation = useNavigation<RegisterScreenProp>();

  const handleRegister = async (nombre: string, apellidos: string, rut: string, email: string, pass: string) => {
    try {
      const { data } = await register({
        variables: {
          firstName: nombre,
          lastName: apellidos,
          rut: rut,
          email: email,
          password: pass,
          role: role,
        },
      });
      const token = data.register.token;
      console.log('Token:', token);
      SecureStore.setItemAsync('authToken', token);
      Alert.alert('Éxito!', 'Te has registrado correctamente.', [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      console.error('Error completo:', error);
      Alert.alert('Error', error.message || 'Error al intentar registrarse');
    }
  };

  const formatoRUT = (text: string) => {
    let value = text.replace(/\./g, '').replace(/-/g, '');

    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    let formattedRut = value;

    if (value.length > 1) {
      formattedRut = value.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + value.slice(-1);
    }

    setRut(formattedRut);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (pass !== passVerifi) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    Alert.alert('Éxito!', 'Te has registrado correctamente.', [
      {
        text: 'Ok',
        onPress: () => navigation.navigate('Login'),
      },
    ]);
    console.log('Name:', nombre, 'Last Name:', apellidos, 'RUT:', rut, 'Email:', email, 'Rol:', role, 'Password:', pass);
    event.preventDefault();
    handleRegister(nombre, apellidos, rut, email, pass);
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center bg-[#95D5B2]`}>
      <View style={tw`bg-[#1B4332] w-80 p-6 shadow-lg rounded-xl flex flex-col gap-4 justify-center`}>
        <Text style={tw`text-white text-2xl`}>Primera vez por aquí? Regístrate!</Text>
        <TextInput
          style={tw`p-2 rounded-xl border w-full bg-white`}
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="none"
        />
        <TextInput
          style={tw`p-2 rounded-xl border w-full bg-white`}
          placeholder="Ingresa tu apellido"
          value={apellidos}
          onChangeText={setApellido}
          autoCapitalize="none"
        />
        <TextInput
          style={tw`p-2 rounded-xl border w-full bg-white`}
          placeholder="Ingresa tu RUT"
          value={rut}
          onChangeText={formatoRUT}
          autoCapitalize="none"
        />
        <TextInput
          style={tw`p-2 rounded-xl border w-full bg-white`}
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={tw`p-2 rounded-xl border w-full bg-white`}>
          <Picker
            style={tw`w-full text-gray-400`}
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Selecciona tu rol" value="" />
            <Picker.Item label="Profesor" value="teacher" />
            <Picker.Item label="Padre/Tutor" value="parents" />
          </Picker>
        </View>
        <TextInput
          style={tw`p-2 rounded-xl border w-full bg-white`}
          placeholder="Ingresa tu contraseña"
          value={pass}
          onChangeText={setPass}
          secureTextEntry
        />
        <TextInput
          style={tw`p-2 rounded-xl border w-full bg-white`}
          placeholder="Repite tu contraseña"
          value={passVerifi}
          onChangeText={setPassVerifi}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleSubmit} style={tw`bg-[#95D5B2] rounded-xl text-2xl py-2 justify-center items-center mt-4`}
        >
          <Text style={tw`text-white`}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={tw`text-white mt-4`}>
            ¿Ya tienes una cuenta? <Text style={tw`text-[#95D5B2] underline`}>Ingresa aquí!</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;
