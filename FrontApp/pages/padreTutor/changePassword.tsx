import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from '../../styles/padreTutor/changePassword.styles';
import { CAMBIAR_CONTRASENA } from "../../graphql/mutations/index";
import { clientUser } from '../../graphql/apollo/apolloClient';
import { useMutation } from "@apollo/client";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [userToken, setUserToken] = useState<string | null>(null);
  
  const [changePassword, { loading, error }] = useMutation(CAMBIAR_CONTRASENA, { client: clientUser });
  const navigation = useNavigation();
  

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        setUserToken(token);
      } else {
        Alert.alert('Error', 'No se encontró el token de autenticación');
      }
    };
    getToken();
  }, []);

  const handlePasswordChange = async () => {
    const pass = await SecureStore.getItemAsync('userPass');
    if (!userToken) {
      Alert.alert('Error', 'No se encontró el token de autenticación');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
      return;
    }

    if (!currentPassword) {
      Alert.alert('Error', 'Por favor, ingresa tu contraseña actual');
      return;
    }
console.log('Contraseña actual:', pass);
console.log('Contraseña ingresada:', currentPassword);
    if (pass !== currentPassword){
      Alert.alert('Error', 'La contraseña actual no coincide con la ingresada');
      return;
    }

    try {
      const { data } = await changePassword({
        variables: { 
          token: userToken,
          newPassword
        },
      });
      
      
      console.log('Respuesta de cambio de contraseña:', data);

      if (data?.changePassword?.message) {
        Alert.alert('¡Contraseña actualizada!', data.changePassword.message, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'Hubo un problema al cambiar la contraseña');
      }
    } catch (err) {
      
      console.error('Error al intentar cambiar la contraseña:', err);
      Alert.alert('Error', 'No se pudo cambiar la contraseña. Por favor, inténtalo más tarde.');
    } finally {
      
      console.log('Finalizó el intento de cambio de contraseña');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña Actual</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Contraseña actual"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Repetir Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Repetir nueva contraseña"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            onPress={handlePasswordChange} 
            style={styles.button} 
            disabled={loading || !userToken}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cambiando...' : 'Actualizar Contraseña'}
            </Text>
          </TouchableOpacity>
          
          {error && (
            <Text style={{ color: 'red', marginTop: 10 }}>
              Error: {error.message}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ChangePassword;