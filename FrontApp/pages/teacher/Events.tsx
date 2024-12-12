import React, { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, FlatList, Alert, TextInput } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_EVENTS, GET_USERS, GET_ALL_COURSES, GET_USER_BY_RUT } from '../../graphql/queries';
import { CREATE_EVENT } from '../../graphql/mutations';
import { Calendar } from 'react-native-calendars';
import * as SecureStore from 'expo-secure-store';
import { clientUser } from '../../graphql/apollo/apolloClient';
import styles from '../../styles/teacher/events.styles';

function Events() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [creatorID, setCreatorID] = useState('');
  const [creatorRole, setCreatorRole] = useState('');
  const [courseID, setCourseID] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);

  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCourseID, setEventCourseID] = useState('');
  const [eventSelectedCourse, setEventSelectedCourse] = useState('');
  const [isCourseSelectorVisible, setIsCourseSelectorVisible] = useState(false);

  const [createEvent] = useMutation(CREATE_EVENT, { client: clientUser });

  const { data: data, loading: loading, error: error } = useQuery(GET_ALL_EVENTS, { 
    client: clientUser,
    fetchPolicy: 'cache-and-network'
  });
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS, { 
    client: clientUser,
    fetchPolicy: 'cache-and-network'
  });
  const { data: coursesData, loading: coursesLoading, error: coursesError } = useQuery(GET_ALL_COURSES, { 
    client: clientUser,
    fetchPolicy: 'cache-and-network'
  });
  //console.log("Data", data);
  //console.log("Users", usersData);
  //console.log("Courses", coursesData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch the creator ID
        const rut = await SecureStore.getItemAsync('userRut');
        const creatorRole = await SecureStore.getItemAsync('userRole');
        console.log("role", creatorRole);
        if (!rut) {
          Alert.alert('Error', 'No se encontró el RUT del usuario.');
          return;
        }
  
        const { data: userData } = await clientUser.query({
          query: GET_USER_BY_RUT,
          variables: { rut },
        });
  
        if (userData && userData.findByRut) {
          setCreatorID(userData.findByRut.id);
        } else {
          Alert.alert('Error', 'Usuario no encontrado.');
        }
  
        // Then, filter events if data exists
        if (data && data.events) {
          const filteredEvents = data.events.filter((event: Event) => {
            if (!selectedDate) return false;
  
            const createdAtDate = new Date(event.createdAt).toISOString().split('T')[0];
            const dueDateDate = new Date(event.dueDate).toISOString().split('T')[0];
  
            return createdAtDate === selectedDate || dueDateDate === selectedDate;
          });
  
          setEvents(filteredEvents);
        }
      } catch (error) {
        console.error('Error en la obtención de datos:', error);
        Alert.alert('Error', 'No se pudieron obtener los datos.');
      }
    };
  
    fetchData();
  }, [data, selectedDate]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  interface Event {
    id: number;
    title: string;
    description: string;
    creatorId: number;
    courseId: number;
    createdAt: string;
    dueDate: string;
    endDate: string;
  }

  const getUserNameById = (id: number) => {
    if (usersLoading || usersError || !usersData?.getAllUser) {
      return 'Cargando...';
    }
    
    const user = usersData.getAllUser.find((user: { id: number }) => user.id == id);
    return user ? `${user.firstName} ${user.lastName}` : 'Desconocido';
  };

  const getCourseNameById = (id: number) => {
    if (coursesLoading || coursesError || !coursesData?.getAllCourse) {
      return 'Cargando...';
    }
    
    const course = coursesData.getAllCourse.find((course: { id: number }) => course.id == id);
    return course ? course.nameCourse : 'Desconocido';
  };

  const openEventModal = () => {
    // Reset event modal state
    setEventTitle('');
    setEventDescription('');
    setEventCourseID('');
    setEventSelectedCourse('');
    setIsEventModalVisible(true);
  };

  const handleCreateEvent = async () => {
    // Validation
    if (!eventTitle || !eventCourseID) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }
console.log("Creator ID", creatorID);
    try {
      const createdAt = new Date();
      const dueDate = new Date(createdAt);
      dueDate.setMonth(dueDate.getMonth() + 1); // Set due date to 1 month later

      const { data } = await createEvent({
        variables: {
          createEventDto: {
            creatorId: parseFloat(creatorID),
            courseId: parseFloat(eventCourseID),
            title: eventTitle,
            description: eventDescription || 'Sin descripción',
            dueDate: dueDate.toISOString(),
          },
        },
      });

      Alert.alert('Éxito', `Evento creado: ${data.createEvent.title}`);
      setIsEventModalVisible(false);
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'No se pudo crear el evento.');
    }
  };

  const renderEventCourseItem = ({ item }: { item: { id: string; nameCourse: string } }) => (
    <TouchableOpacity
      style={styles.courseModalItem}
      onPress={() => {
        setEventSelectedCourse(item.nameCourse);
        setEventCourseID(item.id);
        setIsCourseSelectorVisible(false);
      }}
    >
      <Text style={styles.courseModalItem}>{item.nameCourse}</Text>
    </TouchableOpacity>
  );

  const renderCourseItem = ({ item }: { item: { id: string; nameCourse: string } }) => (
    <TouchableOpacity
      style={styles.courseModalItem}
      onPress={() => {
        setSelectedCourse(item.nameCourse);
        setCourseID(item.id);
        setIsCourseModalVisible(false);
      }}
    >
      <Text style={styles.courseModalItem}>{item.nameCourse}</Text>
    </TouchableOpacity>
  );

  const renderEventItem = (event: Event) => (
    <View style={styles.eventCard}>
      {new Date(event.dueDate).toISOString().split('T')[0] === selectedDate ? (
        <>
          <Text style={styles.eventTitle}>CIERRE</Text>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <Text style={styles.eventDescription}>Autor: {getUserNameById(event.creatorId)}</Text>
          <Text style={styles.eventDescription}>Curso: {getCourseNameById(event.courseId)}</Text>
          <Text style={styles.eventTime}>
            {new Date(event.dueDate).toLocaleTimeString()}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <Text style={styles.eventDescription}>Autor: {getUserNameById(event.creatorId)}</Text>
          <Text style={styles.eventDescription}>Curso: {getCourseNameById(event.courseId)}</Text>
          <Text style={styles.eventTime}>
            {new Date(event.createdAt).toLocaleTimeString()}
          </Text>
        </>
      )}
    </View>
  );
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.subtitle}>Calendario</Text>
          <Calendar
            onDayPress={handleDayPress}
            enableSwipeMonths={true}
            firstDay={1}
            markedDates={{
              [new Date().toISOString().split('T')[0]]: { selected: true, marked: true, selectedColor: '#6a874d' },
            }}
            style={styles.calendar}
            theme={{
              selectedDayBackgroundColor: '#6a874d',
              todayTextColor: '#6a874d',
              arrowColor: '#6a874d',
            }}
          />
        </View>

        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Eventos del día {selectedDate}</Text>
              {loading && <Text>Cargando eventos...</Text>}
              {error && <Text style={styles.errorText}>Error al cargar los eventos.</Text>}

              <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderEventItem(item)}
                ListEmptyComponent={
                  <Text style={styles.noDataText}>No hay eventos para esta fecha.</Text>
                }
              />
              
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {creatorRole !== 'parents' && (
          <TouchableOpacity
            style={styles.button}
            onPress={openEventModal}
          >
            <Text style={styles.buttonText}>Crear Evento</Text>
          </TouchableOpacity>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isEventModalVisible}
          onRequestClose={() => setIsEventModalVisible(false)}
        >
          <View style={styles.courseModalContainer}>
            <View style={styles.courseModalContent}>
              <Text style={styles.courseModalTitle}>Crear Nuevo Evento</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Título del Evento"
                value={eventTitle}
                onChangeText={setEventTitle}
              />

              <TextInput
                style={styles.input}
                placeholder="Descripción (opcional)"
                value={eventDescription}
                onChangeText={setEventDescription}
              />

              <TouchableOpacity 
                style={styles.courseSelectionButton}
                onPress={() => {
                  setIsCourseSelectorVisible(true);
                }}
              >
                <Text style={styles.courseSelectionButtonText}>
                  {eventSelectedCourse || 'Seleccione un curso'}
                </Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCreateEvent}
                >
                  <Text style={styles.buttonText}>Crear Evento</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setIsEventModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Course Selector Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCourseSelectorVisible}
          onRequestClose={() => setIsCourseSelectorVisible(false)}
        >
          <View style={styles.courseModalContainer}>
            <View style={styles.courseModalContent}>
              <Text style={styles.courseModalTitle}>Seleccionar Curso</Text>
              <FlatList
                data={coursesData?.getAllCourse || []}
                renderItem={renderEventCourseItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.courseModalEmptyText}>No hay cursos disponibles</Text>
                }
              />
              <TouchableOpacity
                style={styles.courseModalCloseButton}
                onPress={() => setIsCourseSelectorVisible(false)}
              >
                <Text style={styles.courseModalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Events;
