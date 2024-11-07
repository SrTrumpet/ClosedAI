import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView, GestureResponderEvent } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/HomeLogin.styles';

function HomeLogin() {
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userRut, setUserRut] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userToken, setUserToken] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await SecureStore.getItemAsync('userName');
        const lastName = await SecureStore.getItemAsync('userLastName');
        const rut = await SecureStore.getItemAsync('userRut');
        const role = await SecureStore.getItemAsync('userRole');
        const email = await SecureStore.getItemAsync('userEmail');
        const token = await SecureStore.getItemAsync('authToken');
        console.log('Datos recuperados:', { name, lastName, rut, email, role });

        setUserName(name || '');
        setUserLastName(lastName || '');
        setUserRut(rut || '');
        setUserRole(role || '');
        setUserEmail(email || '');
        setUserToken(token || '');
      } catch (error) {
        console.error('Error al obtener datos de SecureStore:', error);
      }
    };

    fetchUserData();
  }, []);

  const renderButton = (title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, iconName: string, onPress: ((event: GestureResponderEvent) => void) | undefined) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name={iconName} size={20} color="#fff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Colegio Bajos del Cerro Pequeño</Text>
        </View>
        <Text style={styles.title}>
          Bienvenido, {userName}!
        </Text>
        <Text style={styles.subtitle}>
          Rol: {userRole}
        </Text>

        {userRole === 'teacher' && (
          <>
          <Text style={styles.subtitle}>
            Este es el menú de docentes
          </Text>
          <View style={styles.buttonContainer}>
            {renderButton('Ver y actualizar datos personales', 'user', () => navigation.navigate('DatosUsuario' as never))}
          </View>
        </>
        )}
        {userRole === 'parents' && (
          <>
            <Text style={styles.subtitle}>
              Este es el menú de padres y apoderados
            </Text>
            <View style={styles.buttonContainer}>
              {renderButton('Ver y actualizar datos personales', 'user', () => navigation.navigate('DatosUsuario' as never))}
              {renderButton('Ver los datos de tus hijos/pupilos', 'child', () => {/* onPress handler */})}
              {renderButton('Ver calificaciones', 'graduation-cap', () => {/* onPress handler */})}
              {renderButton('Ver asistencias', 'calendar-check-o', () => {/* onPress handler */})}
              {renderButton('Ver hoja de vida', 'file-text-o', () => {/* onPress handler */})}
              {renderButton('Ver y enviar solicitudes y reclamos', 'envelope', () => {/* onPress handler */})}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

export default HomeLogin;