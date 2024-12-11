import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ImageBackground, FlatList, Modal, TextInput, Alert, GestureResponderEvent } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { useQuery, useMutation } from '@apollo/client';
import { clientUser } from '../graphql/apollo/apolloClient';
import { CREAR_ANUNCIO } from '../graphql/mutations';
import { GET_NEWS, GET_USER_BY_RUT } from '../graphql/queries';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/HomeLogin.styles';

interface News {
  id: string;
  title: string;
  content: string;
  publisher: string;
  idUser: string;
  createdAt: string;
}

function HomeLogin() {
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userRut, setUserRut] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [image, setImage] = useState<string>('');

  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_NEWS, { client: clientUser });
  const { data: userData, refetch: refetchUser } = useQuery(GET_USER_BY_RUT, {
    variables: { rut: userRut },
    client: clientUser,
    skip: !userRut,
  });
  const [createNews] = useMutation(CREAR_ANUNCIO, { client: clientUser });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await SecureStore.getItemAsync('userName');
        const lastName = await SecureStore.getItemAsync('userLastName');
        const rut = await SecureStore.getItemAsync('userRut');
        const role = await SecureStore.getItemAsync('userRole');
        const email = await SecureStore.getItemAsync('userEmail');
        const token = await SecureStore.getItemAsync('authToken');
        console.log('Datos recuperados:', { name, lastName, rut, email, role, token });

        setUserName(name || '');
        setUserLastName(lastName || '');
        setUserRut(rut || '');
        setUserRole(role || '');
        setUserEmail(email || '');
        setUserToken(token || '');

        if (rut) {
          refetchUser();
        }
      } catch (error) {
        console.error('Error al obtener datos de SecureStore:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData && userData.findByRut) {
      setUserId(userData.findByRut.id);
    }
  }, [userData]);

  const renderButton = (title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, iconName: string, onPress: ((event: GestureResponderEvent) => void) | undefined) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name={iconName} size={20} color="#fff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderAnnouncement = ({ item }: any) => (
    <ImageBackground
      source={{ uri: item.imageUrl || 'image' }}
      style={styles.announcementCard}
      resizeMode="cover"
    >
      <View style={styles.announcementOverlay}>
        <Text style={styles.announcementTitle}>{item.title}</Text>
        <Text style={styles.announcementDescription}>{item.description}</Text>
      </View>
    </ImageBackground>
  );

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para subir imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateNews = async () => {
    if (!newTitle || !newDescription) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener la ID del usuario.');
      return;
    }

    try {
      await createNews({
        variables: {
            title: newTitle,
            description: newDescription,
            imageUrl: image || 'image',
          },
      });
      Alert.alert('Éxito', 'El anuncio ha sido creado.');
      setModalVisible(false);
      setNewTitle('');
      setNewDescription('');
      setImage('');
      refetch(); // Refresh the list of announcements
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear el anuncio.');
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}
    onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
    scrollEventThrottle={16}
    >
      
      <View style={styles.container}>
        <Text style={styles.title}>
          Bienvenido, {userName}!
        </Text>

        <Text style={styles.sectionTitle}>Tablero de Anuncios</Text>
          {loading ? (
            <Text>Cargando anuncios...</Text>
          ) : data?.getAllNotices?.length === 0 ? (
            <Text>No hay anuncios disponibles en este momento.</Text>
          ) : error ? (
            <Text>Error al cargar los anuncios</Text>
          ) : (
            <FlatList
              data={data?.getAllNotices.slice().sort((a: News, b: News) => parseInt(b.id) - parseInt(a.id))}
              renderItem={renderAnnouncement}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.announcementList}
            />
        )}

        {(userRole === 'teacher' || userRole === 'admin') && (
          <TouchableOpacity
            style={styles.createAnnouncementButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.createAnnouncementText}>Crear Anuncio</Text>
          </TouchableOpacity>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Anuncio</Text>
              <TextInput
                style={styles.input}
                placeholder="Título del anuncio"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={newDescription}
                onChangeText={setNewDescription}
              />
              <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
                <Text style={styles.imageButtonText}>
                  {image ? 'Imagen seleccionada' : 'Seleccionar Imagen'}
                </Text>
              </TouchableOpacity>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleCreateNews}>
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {userRole === 'admin' && (
          <>
          <Text style={styles.subtitle}>
            Este es el menú de administrador
          </Text>
          <View style={styles.buttonContainer}>
            {renderButton('Ver datos personales', 'user', () => navigation.navigate('DatosUsuario' as never))}
            {renderButton('Ver y modificar datos de usuario', 'child', () => {navigation.navigate('UserManagement' as never)})}
            {renderButton('Crear y modificar asignaturas', 'book', () => {navigation.navigate('Subjects' as never)})}
            {renderButton('Crear y modificar cursos y semestres', 'calendar-check-o', () => {navigation.navigate('CourseSemester' as never)})}
            {renderButton('Calificar estudiantes', 'check-square-o', () => {navigation.navigate('Grades' as never)})}
            {renderButton('Gestionar eventos', 'calendar', () => {navigation.navigate('Events' as never)})}
          </View>
        </>
        )}

        {userRole === 'teacher' && (
          <>
          <Text style={styles.subtitle}>
            Este es el menú de docentes
          </Text>
          <View style={styles.buttonContainer}>
            {renderButton('Ver y actualizar datos personales', 'user', () => navigation.navigate('DatosUsuario' as never))}
            {renderButton('Ver datos de estudiantes', 'child', () => {navigation.navigate('DatosHijos' as never)})}
            {renderButton('Crear y modificar asignaturas', 'book', () => {navigation.navigate('Subjects' as never)})}
            {renderButton('Agregar y desplegar asistencia', 'hand-stop-o', () => {navigation.navigate('Attendance' as never)})}
            {renderButton('Calificar estudiantes', 'check-square', () => {navigation.navigate('Grades' as never)})}
            {renderButton('Agregar eventos', 'calendar', () => {navigation.navigate('Events' as never)})}
          </View>

          <View style={[styles.floatingButtonContainer, { transform: [{ translateY: scrollY }] },]}>
            <TouchableOpacity
              style={[styles.floatingButton, { zIndex: 2 }]}
              onPress={() => setNotificationsVisible(true)}
            >
              <Icon name="bell" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.floatingButton, { zIndex: 1 }]}
              onPress={() => setChatVisible(true)}
            >
              <Icon name="comment" size={24} color="#fff" />
            </TouchableOpacity>
         </View>

        <Modal visible={notificationsVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Notificaciones</Text>
              <Text>No tienes nuevas notificaciones.</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setNotificationsVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={chatVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chat</Text>
              <Text>No tienes mensajes nuevos.</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setChatVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        </>
        )}
        {userRole === 'parents' && (
          <>
            <Text style={styles.subtitle}>
              Este es el menú de padres y apoderados
            </Text>
            <View style={styles.buttonContainer}>
              {renderButton('Ver y actualizar datos personales', 'user', () => navigation.navigate('DatosUsuario' as never))}
              {renderButton('Ver los datos de tus hijos/pupilos', 'child', () => {navigation.navigate('DatosHijos' as never)})}
              {renderButton('Ver asistencias', 'calendar-check-o', () => {navigation.navigate('Attendance' as never)})}
              {renderButton('Ver hoja de vida', 'file-text-o', () => {navigation.navigate('AcademicRecord' as never)})}
              {renderButton('Ver y enviar solicitudes y reclamos', 'envelope', () => {navigation.navigate('Suggestions' as never)})}
              {renderButton('Ver eventos', 'calendar', () => {navigation.navigate('Events' as never)})}
            </View>

            <View style={[styles.floatingButtonContainer, { transform: [{ translateY: scrollY }] },]}>
            <TouchableOpacity
              style={[styles.floatingButton, { zIndex: 2 }]}
              onPress={() => setNotificationsVisible(true)}
            >
              <Icon name="bell" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.floatingButton, { zIndex: 1 }]}
              onPress={() => setChatVisible(true)}
            >
              <Icon name="comment" size={24} color="#fff" />
            </TouchableOpacity>
         </View>

        <Modal visible={notificationsVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Notificaciones</Text>
              <Text>No tienes notificaciones.</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setNotificationsVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={chatVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chat</Text>
              <Text>No tienes mensajes en tu historial.</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setChatVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

          </>
        )}
      </View>
    </ScrollView>
  );
}

export default HomeLogin;