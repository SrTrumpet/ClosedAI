import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView, Modal } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../../styles/teacher/subjects.styles';
import { clientUser } from '../../graphql/apollo/apolloClient';
import { CREAR_ASIGNATURA, ACTUALIZAR_ASIGNATURA } from '../../graphql/mutations';
import { GET_SUBJECTS, GET_ALL_COURSES } from '../../graphql/queries';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome';

function Subjects() {
  interface Subject {
    id: string;
    name: string;
    numberOfClasses: number;
    courseId: string;
  }

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [numberOfClasses, setNumberOfClasses] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const [tempName, setTempName] = useState('');
  const [tempNumberOfClasses, setTempNumberOfClasses] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingNumberOfClasses, setIsEditingNumberOfClasses] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_SUBJECTS, { client: clientUser });
  const [createSubject] = useMutation(CREAR_ASIGNATURA, { client: clientUser });
  const [updateSubject] = useMutation(ACTUALIZAR_ASIGNATURA, { client: clientUser });

  const { data: coursesData, loading: coursesLoading, error: coursesError } = useQuery(GET_ALL_COURSES, {
    client: clientUser,
  });

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      setToken(token || null);
    };
    getToken();

    if (selectedSubject) {
      setName(selectedSubject.name);
      setNumberOfClasses(selectedSubject.numberOfClasses.toString());

      setTempName(selectedSubject.name);
      setTempNumberOfClasses(selectedSubject.numberOfClasses.toString());
    }
  }, [selectedSubject]);

  const handleCreate = async () => {
    if (!token) {
      Alert.alert('Error', 'Token no encontrado');
      return;
    }

    if (!name || numberOfClasses === '' || !selectedCourse) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const numClasses = parseInt(numberOfClasses, 10);
    if (isNaN(numClasses) || numClasses < 0) {
      Alert.alert('Error', 'La cantidad de clases debe ser un número mayor o igual a 0');
      return;
    }

    try {
      const response = await createSubject({
        variables: {
          createSubjectInput: {
            name,
            numberOfClasses: numClasses,
            courseId: parseInt(selectedCourse, 10),
          },
        },
      });

      if (response.data.createSubject) {
        Alert.alert('Asignatura creada con éxito');
        refetch();
        setSelectedSubject(null);
        setName('');
        setNumberOfClasses('');
        setSelectedCourse(null);
      } else {
        Alert.alert('Error', 'No se pudo crear la asignatura');
      }
    } catch (error) {
      console.error('Error al crear asignatura:', error);
      Alert.alert('Error', 'Hubo un problema al crear la asignatura');
    }
  };

  const handleUpdate = async () => {
    if (!token || !selectedSubject) {
      Alert.alert('Error', 'Token o asignatura no encontrados');
      return;
    }

    const numClasses = parseInt(tempNumberOfClasses, 10);
    if (isNaN(numClasses) || numClasses < 0) {
      Alert.alert('Error', 'La cantidad de clases debe ser un número mayor o igual a 0');
      return;
    }

    try {
      await updateSubject({
        variables: {
          updateSubjectInput: {
            name: selectedSubject.name,
            newName: tempName,
            numberOfClasses: numClasses,
            courseId: selectedSubject.courseId ? parseInt(selectedSubject.courseId, 10) : null,
          },
        },
      });
      Alert.alert('Asignatura actualizada correctamente');
      refetch();
      setSelectedSubject(null);
    } catch (error) {
      console.error('Error al actualizar asignatura:', error);
      Alert.alert('Error', 'No se pudo actualizar la asignatura');
    }
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

  if (loading) return <Text>Cargando asignaturas...</Text>;
  if (error) return <Text>Error al cargar asignaturas</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {!selectedSubject ? (
          <>
            <Text style={styles.subtitle}>Listado de asignaturas</Text>
            {data?.listSubject?.map((subject: Subject, index: number) => (
              <TouchableOpacity
                key={subject.id}
                onPress={() => {
                  setSelectedSubject(subject);
                  setTempName(subject.name);
                  setTempNumberOfClasses(subject.numberOfClasses.toString());
                }}
                style={styles.subjectItem}
              >
                <Text style={styles.subjectItemText}>{index + 1}. {subject.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setSelectedSubject({
              id: '',
              name: '',
              numberOfClasses: 0,
              courseId: ''
            })} style={styles.button}>
              <Text style={styles.buttonText}>Crear nueva asignatura</Text>
            </TouchableOpacity>

          </>
        ) : (
          <>
            {selectedSubject.id === '' ? (
              <>
                <Text style={styles.subtitle}>Creación de Asignatura</Text>
                {renderEditableInfo('book', 'Nombre', name, isEditingName, setIsEditingName, setName)}
                {renderEditableInfo('table', 'Cantidad de Clases', numberOfClasses, isEditingNumberOfClasses, setIsEditingNumberOfClasses, setNumberOfClasses)}
                <Text style={styles.infoContainer}>
                  Curso: {selectedCourse ? coursesData?.getAllCourse.find((course: { id: string; }) => course.id === selectedCourse)?.nameCourse : 'No seleccionado'}
                </Text>
                
                <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.button}>
                  <Text style={styles.buttonText}>Seleccionar Curso</Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalVisible}
                  onRequestClose={() => setIsModalVisible(false)}
                >
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Selecciona un Curso</Text>
                      <ScrollView>
                        {coursesData?.getAllCourse?.map((course: { id: string, nameCourse: string }) => (
                          <TouchableOpacity
                            key={course.id}
                            style={styles.modalItem}
                            onPress={() => {
                              setSelectedCourse(course.id);
                              setIsModalVisible(false);
                            }}
                          >
                            <Text style={styles.modalItemText}>{course.nameCourse}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setIsModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                <TouchableOpacity onPress={handleCreate} style={styles.button}>
                  <Text style={styles.buttonText}>Guardar Asignatura</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedSubject(null)} style={styles.button}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>Editar Asignatura</Text>
                {renderEditableInfo('book', 'Nombre', tempName, isEditingName, setIsEditingName, setTempName)}
                {renderEditableInfo('table', 'Cantidad de Clases', tempNumberOfClasses, isEditingNumberOfClasses, setIsEditingNumberOfClasses, setTempNumberOfClasses)}
                <Text style={styles.infoContainer}>
                  Curso: {selectedSubject.courseId ? 
                    coursesData?.getAllCourse.find((course: { id: string; }) => course.id === selectedSubject.courseId)?.nameCourse 
                    : 'No seleccionado'}
                </Text>

                <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.button}>
                  <Text style={styles.buttonText}>Cambiar Curso</Text>
                </TouchableOpacity>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalVisible}
                  onRequestClose={() => setIsModalVisible(false)}
                >
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Selecciona un Curso</Text>
                      <ScrollView>
                        {coursesData?.getAllCourse?.map((course: { id: string, nameCourse: string }) => (
                          <TouchableOpacity
                            key={course.id}
                            style={styles.modalItem}
                            onPress={() => {
                              // Update the selectedSubject's courseId
                              setSelectedSubject(prev => prev ? {...prev, courseId: course.id} : null);
                              setIsModalVisible(false);
                            }}
                          >
                            <Text style={styles.modalItemText}>{course.nameCourse}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setIsModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                
                <TouchableOpacity onPress={handleUpdate} style={styles.button}>
                  <Text style={styles.buttonText}>Guardar cambios</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedSubject(null)} style={styles.button}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

export default Subjects;
