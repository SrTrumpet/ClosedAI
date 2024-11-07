import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, GestureResponderEvent } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/padreTutor/datosUsuario.styles';
import { ACTUALIZAR_USUARIO } from "../../graphql/mutations/index";
import { clientUser } from '../../graphql/apollo/apolloClient';
import { useMutation } from "@apollo/client";
import { useNavigation } from '@react-navigation/native';

function DatosUsuario() {
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

  const handleSaveChanges = async () => {
    try {
      await SecureStore.setItemAsync('userName', tempUserName);
      await SecureStore.setItemAsync('userLastName', tempUserLastName);
      await SecureStore.setItemAsync('userEmail', tempUserEmail);
      await SecureStore.setItemAsync('userRole', userRole);
      await SecureStore.setItemAsync('userRut', userRut);

      await changeData({
        variables: {
          rut: await SecureStore.getItemAsync('userRut'),
          updateUserDto: { firstName: tempUserName, lastName: tempUserLastName, email: tempUserEmail }
        }
      });

      setUserName(tempUserName);
      setUserLastName(tempUserLastName);
      setUserEmail(tempUserEmail);

      Alert.alert('¡Éxito!', 'Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar datos en SecureStore:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    }
  };

  const renderEditableInfo = (iconName: string, label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, isEditing: boolean, setIsEditing: { (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }, setTempValue: ((text: string) => void) | undefined) => (
    <View style={styles.infoContainer}>
      <Icon name={iconName} size={20} color="#6a874d" style={styles.infoIcon} />
      {isEditing ? (
        <TextInput
          style={styles.infoText}
          value={typeof value === 'string' ? value : ''}
          onChangeText={setTempValue}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <Text style={styles.infoText}>{label}: {value}</Text>
      )}
      <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIconContainer}>
        <Icon name="pencil" size={20} color="#6a874d" style={styles.editIcon} />
      </TouchableOpacity>
    </View>
  );

  const renderButton = (title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, iconName: string, onPress: ((event: GestureResponderEvent) => void) | undefined) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name={iconName} size={20} color="#fff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderInfo = (iconName: string, label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
    <View style={styles.infoContainer}>
      <Icon name={iconName} size={20} color="#6a874d" style={styles.infoIcon} />
      <Text style={styles.infoText}>{label}: {value}</Text>
    </View>
  );

  const isEditing = isEditingName || isEditingLastName || isEditingEmail;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Ver perfil</Text>
          </View>
          <Text style={styles.subtitle}>Información personal</Text>
          {renderEditableInfo('user', 'Nombre', tempUserName, isEditingName, setIsEditingName, setTempUserName)}
          {renderEditableInfo('user', 'Apellido', tempUserLastName, isEditingLastName, setIsEditingLastName, setTempUserLastName)}
          {renderInfo('id-card', 'RUT', userRut)}
          {renderEditableInfo('envelope', 'E-mail', tempUserEmail, isEditingEmail, setIsEditingEmail, setTempUserEmail)}
          {renderInfo('star', 'Rol', translateRole(userRole))}
          {renderButton('¿Cambiar contraseña?', 'key', () => navigation.navigate('ChangePassword' as never))}

          {isEditing && (
            <TouchableOpacity onPress={handleSaveChanges} style={styles.button} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar cambios'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default DatosUsuario;
