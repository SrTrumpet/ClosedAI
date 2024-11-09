import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, GestureResponderEvent } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/padreTutor/datosUsuario.styles';
import { ACTUALIZAR_USUARIO } from "../../graphql/mutations/index";
import { clientUser } from '../../graphql/apollo/apolloClient';
import { useMutation } from "@apollo/client";
import { useNavigation } from '@react-navigation/native';

function StudentGrades() {
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userRut, setUserRut] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  const [tempUserName, setTempUserName] = useState('');
  const [tempUserLastName, setTempUserLastName] = useState('');
  const [tempUserEmail, setTempUserEmail] = useState('');

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [changeData, { loading }] = useMutation(ACTUALIZAR_USUARIO, { client: clientUser });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await SecureStore.getItemAsync('userName');
        const lastName = await SecureStore.getItemAsync('userLastName');
        const rut = await SecureStore.getItemAsync('userRut');
        const email = await SecureStore.getItemAsync('userEmail');
        const role = await SecureStore.getItemAsync('userRole');

        setUserName(name || '');
        setUserLastName(lastName || '');
        setUserEmail(email || '');
        setUserRut(rut || '');
        setUserRole(role || '');

        setTempUserName(name || '');
        setTempUserLastName(lastName || '');
        setTempUserEmail(email || '');
      } catch (error) {
        console.error('Error al obtener datos de SecureStore:', error);
      }
    };

    fetchUserData();
  }, []);

  const translateRole = (role: string) => {
    switch (role) {
      case 'teacher': return 'Profesor';
      case 'parents': return 'Padre/Tutor';
      case 'student': return 'Estudiante';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  const renderInfo = (iconName: string, label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
    <View style={styles.infoContainer}>
      <Icon name={iconName} size={20} color="#6a874d" style={styles.infoIcon} />
      <Text style={styles.infoText}>{label}: {value}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.subtitle}>Este será el espacio para la información de las calificaciones</Text>
          {renderInfo('user', 'Nombre', tempUserName)}
          {renderInfo('user', 'Apellido', tempUserLastName)}
          {renderInfo('id-card', 'RUT', userRut)}
          {renderInfo('envelope', 'E-mail', tempUserEmail)}
          {renderInfo('star', 'Rol', translateRole(userRole))}
          
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default StudentGrades;