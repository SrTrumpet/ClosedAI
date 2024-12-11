import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/admin/userManagement.styles';
import { GET_USERS } from "../../graphql/queries/index";
import { ACTUALIZAR_USUARIO, CREAR_USUARIO, ELIMINAR_USUARIO } from '../../graphql/mutations/index';
import { clientUser } from '../../graphql/apollo/apolloClient';
import { useQuery, useMutation } from "@apollo/client";
import { useNavigation } from '@react-navigation/native';

function UserManagement() {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    rut: string;
    email: string;
    password: string;
    role: string;
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userRut, setUserRut] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  const [tempUserName, setTempUserName] = useState('');
  const [tempUserLastName, setTempUserLastName] = useState('');
  const [tempUserRut, setTempUserRut] = useState('');
  const [tempUserEmail, setTempUserEmail] = useState('');
  const [tempUserRole, setTempUserRole] = useState('');

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [isEditingRut, setIsEditingRut] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_USERS, { client: clientUser });
  const [changeData] = useMutation(ACTUALIZAR_USUARIO, { client: clientUser });
  const [createUser] = useMutation(CREAR_USUARIO, { client: clientUser });
  const [deleteUser] = useMutation(ELIMINAR_USUARIO, { client: clientUser });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedRole = await SecureStore.getItemAsync('userRole');
        setUserRole(loggedRole || '');
        console.log('Datos recuperados en datosUsuario:', { loggedRole });
        console.log('Datos de usuarios:', data);
      } catch (error) {
        console.error('Error al obtener datos de SecureStore:', error);
      }
    };
    fetchUserData();
    
    if (selectedUser) {
      setUserName(selectedUser.firstName);
      setUserLastName(selectedUser.lastName);
      setUserRut(selectedUser.rut);
      setUserEmail(selectedUser.email);
      setUserRole(selectedUser.role);

      setTempUserName(selectedUser.firstName);
      setTempUserLastName(selectedUser.lastName);
      setTempUserRut(selectedUser.rut);
      setTempUserEmail(selectedUser.email);
      setTempUserRole(selectedUser.role);
    }
  }, [selectedUser]);

  const translateRole = (role: string) => {
    switch (role) {
      case 'Student': return 'Estudiante';
      case 'teacher': return 'Profesor';
      case 'parents': return 'Padre/Tutor';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  const handleSaveChanges = async () => {
    if (!validateEmail(tempUserEmail)) {
      Alert.alert('Error', 'El formato del correo electrónico no es válido');
      return;
    }

    // Verificar si el correo electrónico ya está registrado, ignorando el correo del usuario actual
    const emailExists = data.getAllUser.some((user: User) => user.email === tempUserEmail && user.id !== selectedUser?.id);
    if (emailExists) {
      Alert.alert('Error', 'El correo electrónico ya está registrado');
      return;
    }

    try {
      await changeData({
        variables: {
          rut: userRut,
          updateUserDto: { firstName: tempUserName, lastName: tempUserLastName, email: tempUserEmail }
        }
      });

      setUserName(tempUserName);
      setUserLastName(tempUserLastName);
      setUserEmail(tempUserEmail);

      Alert.alert('¡Éxito!', 'Datos actualizados correctamente');
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error('Error al guardar datos en SecureStore:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    }
  };

  const handleCreateUser = async () => {
    if (!tempUserName || !tempUserLastName || !tempUserRut || !tempUserEmail) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!validateEmail(tempUserEmail)) {
      Alert.alert('Error', 'El formato del correo electrónico no es válido');
      return;
    }

    const validRoles = ['Teacher', 'Student', 'Parents'];
    if (!validRoles.includes(tempUserRole)) {
        Alert.alert('Error', 'El rol ingresado no es válido. Debe ser "teacher", "student" o "parent".');
        return;
    }

    const emailExists = data.getAllUser.some((user: User) => user.email === tempUserEmail);
    if (emailExists) {
      Alert.alert('Error', 'El correo electrónico ya está registrado');
      return;
    }

    try {
      await createUser({
        variables: {
          createUserDto: {
            firstName: tempUserName,
            lastName: tempUserLastName,
            rut: tempUserRut,
            email: tempUserEmail,
            role: tempUserRole,
            password: 'defaultPassword'
          },
          
        }
      });

      Alert.alert('¡Éxito!', 'Usuario creado correctamente');
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      Alert.alert('Error', 'No se pudo crear el usuario');
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

    setTempUserRut(formattedRut);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const renderEditableInfo = (iconName: string, label: string, value: string, isEditing: boolean, setIsEditing: (value: boolean) => void, setTempValue: (text: string) => void) => (
    <View style={styles.infoContainer}>
      <Icon name={iconName} size={20} color="#6a874d" style={styles.infoIcon} />
      {isEditing ? (
        <TextInput
          style={styles.infoText}
          value={value}
          onChangeText={setTempValue}
          onBlur={() => setIsEditing(false)}
          keyboardType={label === 'E-mail' ? 'email-address' : 'default'}
        />
      ) : (
        <Text style={styles.infoText}>{label}: {value}</Text>
      )}
    <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIconContainer}>
        <Icon name="pencil" size={20} color="#6a874d" style={styles.editIcon} />
    </TouchableOpacity>
    </View>
  );

  const renderInfo = (iconName: string, label: string, value: string) => (
    <View style={styles.infoContainer}>
      <Icon name={iconName} size={20} color="#6a874d" style={styles.infoIcon} />
      <Text style={styles.infoText}>{label}: {value}</Text>
    </View>
  );

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar los datos</Text>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {!selectedUser ? (
            <>
              <Text style={styles.subtitle}>Seleccione un usuario para ver y editar sus datos</Text>
              {data && data.getAllUser && data.getAllUser.length > 0 ? (
                data.getAllUser.map((user: User, index: number) => (
                  <TouchableOpacity key={user.id} onPress={() => setSelectedUser(user)} style={styles.userItem}>
                    <Text style={styles.userItemText}>{index + 1}. {user.firstName} {user.lastName}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No hay usuarios disponibles</Text>
              )}
                <TouchableOpacity onPress={() => setSelectedUser({ id: '', firstName: '', lastName: '', rut: '', email: '', password: '', role: '' })} style={styles.button}>
                  <Text style={styles.buttonText}>Crear Usuario</Text>
                </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>{selectedUser.id ? 'Información personal' : 'Creación de usuario'}</Text>
              {renderEditableInfo('user', 'Nombre', tempUserName, isEditingName, setIsEditingName, setTempUserName)}
              {renderEditableInfo('user', 'Apellido', tempUserLastName, isEditingLastName, setIsEditingLastName, setTempUserLastName)}
              {selectedUser.id ? renderInfo('id-card', 'RUT', tempUserRut) : renderEditableInfo('id-card', 'RUT', tempUserRut, isEditingRut, setIsEditingRut, formatoRUT)}
              {renderEditableInfo('envelope', 'E-mail', tempUserEmail, isEditingEmail, setIsEditingEmail, setTempUserEmail)}
              {selectedUser.id ? renderInfo('star', 'Rol', translateRole(tempUserRole)) : renderEditableInfo('star', 'Rol', tempUserRole, isEditingRole, setIsEditingRole, setTempUserRole)}

              {(isEditingName || isEditingLastName || isEditingEmail) && userRole !== 'teacher' && (
                <TouchableOpacity onPress={selectedUser.id ? handleSaveChanges : handleCreateUser} style={styles.button} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar cambios'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.button}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedUser && selectedUser.id && (
            <TouchableOpacity
              onPress={() => {
                if (tempUserRole === 'Admin') {
                  Alert.alert('Error', 'No se puede eliminar un usuario con rol de administrador');
                  return;
                }
                Alert.alert(
                  "Confirmar eliminación",
                  "¿Estás seguro de que deseas eliminar este usuario?",
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Eliminar",
                      onPress: async () => {
                        try {
                          await deleteUser({ variables: { rut: tempUserRut } });
                          Alert.alert("Usuario eliminado", "El usuario ha sido eliminado exitosamente.");
                          setSelectedUser(null);
                          refetch(); // Actualizar la lista de usuarios
                        } catch (error) {
                          console.error("Error al eliminar usuario:", error);
                          Alert.alert("Error", "No se pudo eliminar el usuario.");
                        }
                      },
                      style: "destructive",
                    },
                  ]
                );
              }}
              style={[styles.button, { backgroundColor: '#820a0a' }]}
            >
              <Text style={styles.buttonText}>Eliminar Usuario</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default UserManagement;