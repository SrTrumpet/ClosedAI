import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../../styles/admin/courseSemester.styles';
import { clientUser } from '../../graphql/apollo/apolloClient';
import { CREATE_COURSE, UPDATE_COURSE, DELETE_COURSE, CREATE_SEMESTER, UPDATE_SEMESTER, DELETE_SEMESTER } from '../../graphql/mutations';
import { GET_ALL_COURSES, GET_ALL_SEMESTERS } from '../../graphql/queries';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome';

const courseLevels = ["Seleccione el nivel", "Basica", "Media", "Kinder", "PreKinder"];

function CourseSemesterManagement() {
  const [isManagingCourses, setIsManagingCourses] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
      [x: string]: any; id: string; name: string; extraField?: any 
} | null>(null);

  const [name, setName] = useState('');
  const [extraField, setExtraField] = useState({ startDate: '', endDate: '', deadline: '' }); // Level for courses or date for semesters
  const [level, setLevel] = useState("Seleccione el nivel");
  const [token, setToken] = useState<string | null>(null);

  const { data: courseData, refetch: refetchCourses } = useQuery(GET_ALL_COURSES, { client: clientUser });
  const { data: semesterData, refetch: refetchSemesters } = useQuery(GET_ALL_SEMESTERS, { client: clientUser });

  const [createCourse] = useMutation(CREATE_COURSE, { client: clientUser });
  const [updateCourse] = useMutation(UPDATE_COURSE, { client: clientUser });
  const [deleteCourse] = useMutation(DELETE_COURSE, { client: clientUser });

  const [createSemester] = useMutation(CREATE_SEMESTER, { client: clientUser });
  const [updateSemester] = useMutation(UPDATE_SEMESTER, { client: clientUser });
  const [deleteSemester] = useMutation(DELETE_SEMESTER, { client: clientUser });

  useEffect(() => {
    const getToken = async () => {
      const authToken = await SecureStore.getItemAsync('authToken');
      setToken(authToken || null);
    };
    getToken();

    if (selectedItem) {
      setName(selectedItem.name);
      if (isManagingCourses) {
        setLevel(selectedItem.extraField || "Seleccione el nivel");
      } else {
        setExtraField(selectedItem.extraField || { startDate: '', endDate: '', deadline: '' });
      }
    }
  }, [selectedItem]);

  const validateDates = () => {
    const { startDate, endDate, deadline } = extraField;
    const start = new Date(startDate.split('-').reverse().join('-'));
    const end = new Date(endDate.split('-').reverse().join('-'));
    const dead = new Date(deadline.split('-').reverse().join('-'));

    if (start >= end || start >= dead || end >= dead) {
      Alert.alert('Error', 'La fecha de inicio debe ser menor que la de término y la de deadline, y la de término menor que la de deadline.');
      return false;
    }
    return true;
  };

  const formatDate = (date: string) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  const formatDateInput = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // Format the date as DD-MM-YYYY
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4)}`;
    }

    // Validate day and month ranges
    const [day, month] = formatted.split('-');
    if (day && (parseInt(day) < 1 || parseInt(day) > 31)) {
      formatted = formatted.slice(0, 2);
    }
    if (month && (parseInt(month) < 1 || parseInt(month) > 12)) {
      formatted = formatted.slice(0, 5);
    }

    return formatted;
  };

  const handleCreate = async () => {
    if (!token) {
      Alert.alert('Error', 'Token no encontrado');
      return;
    }

    if (!name || (isManagingCourses ? level === "Seleccione el nivel" : !extraField.startDate || !extraField.endDate || !extraField.deadline)) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!isManagingCourses && !validateDates()) {
      return;
    }

    try {
      if (isManagingCourses) {
        const existingCourse = courseData?.listCourses?.find((course: { name: string; }) => course.name === name);
        if (existingCourse) {
          Alert.alert('Error', 'El nombre del curso ya existe');
          return;
        }

        await createCourse({ variables: { createCourseDto: { nameCourse: name, level } } });
        refetchCourses();
        setLevel("Seleccione el nivel");
      } else {
        console.log('SemesterData', semesterData);
        const existingSemester = semesterData?.listSemesters?.find((semester: { name: string; }) => semester.name === name);
        if (existingSemester) {
          Alert.alert('Error', 'El nombre del semestre ya existe');
          return;
        }

        await createSemester({
          variables: {
            createSemesterDto: {
              nameSemester: name,
              startDate: formatDate(extraField.startDate),
              endDate: formatDate(extraField.endDate),
              deadline: formatDate(extraField.deadline)
            }
          }
        });
        refetchSemesters();
      }

      Alert.alert('Creado con éxito');
      resetForm();
    } catch (error) {
      console.error('Error al crear:', error);
      const errorMessage = (error as any).message || 'Hubo un problema al crear el ítem';
      Alert.alert('Error:', errorMessage);
    }
  };

  const handleUpdate = async () => {
    try {
      if (isManagingCourses) {
        await updateCourse({
          variables: { updateCourseDto: { nameCourse: selectedItem?.name, newName: name, level: level, newLevel: level } }
        });
        refetchCourses();
      } else {
        await updateSemester({
          variables: {
            updateSemesterDto: {
              nameSemester: selectedItem?.name || '',
              newNameSemester: name,
              startDate: extraField.startDate,
              endDate: extraField.endDate,
              deadline: extraField.deadline,
            }
          }
        });
        refetchSemesters();
      }
      Alert.alert('Actualizado con éxito');
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error al actualizar');
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setName('');
    setExtraField({ startDate: '', endDate: '', deadline: '' });
    setLevel("Seleccione el nivel");
  };

  const openEditModal = (item: React.SetStateAction<{ id: string; name: string; extraField?: any; } | null>) => {
    setSelectedItem(item);
    if (item) {
      setName(item.name);
    }
    if (item && typeof item !== 'function' && isManagingCourses) setLevel(item.extraField?.level || "Seleccione el nivel");
    else if (item) {
      setExtraField({
        startDate: typeof item !== 'function' ? item.extraField?.startDate || '' : '',
        endDate: typeof item !== 'function' ? item.extraField?.endDate || '' : '',
        deadline: typeof item !== 'function' ? item.extraField?.deadline || '' : ''
      });
    }
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      if (isManagingCourses) {
        await deleteCourse({ variables: { nameCourse: selectedItem?.name, newName: name } });
        refetchCourses();
      } else {
        if (selectedItem) {
          await deleteSemester({ variables: { nameSemester: selectedItem.nameSemester } });
        }
        refetchSemesters();
      }
      Alert.alert('Eliminado con éxito');
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error al eliminar:', error);
      Alert.alert('Error al eliminar');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsManagingCourses(true)} style={styles.button}>
          <Text style={styles.buttonText}>Gestionar Cursos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsManagingCourses(false)} style={styles.button}>
          <Text style={styles.buttonText}>Gestionar Semestres</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowListModal(true)} style={styles.button}>
          <Text style={styles.buttonText}>Ver Cursos/Semestres</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>{isManagingCourses ? "Cursos" : "Semestres"}</Text>


        <Modal visible={showListModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Lista de {isManagingCourses ? "Cursos" : "Semestres"}</Text>
              <ScrollView>
                {(isManagingCourses ? courseData?.listCourses : semesterData?.listSemesters)?.map((item: { id: string; name: string; extraField?: any }, index: number) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => openEditModal(item)}
                    style={styles.subjectItem}
                  >
                    <Text style={styles.subjectItemText}>{index + 1}. {item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowListModal(false)} style={styles.closeButton}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />

        {isManagingCourses ? (
          <Picker
            selectedValue={level}
            style={styles.input}
            onValueChange={(itemValue) => setLevel(itemValue)}
          >
            {courseLevels.map((levelOption) => (
              <Picker.Item key={levelOption} label={levelOption} value={levelOption} />
            ))}
          </Picker>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Fecha de Inicio (DD-MM-AAAA)"
              value={extraField.startDate}
              onChangeText={(value) => setExtraField({ ...extraField, startDate: formatDateInput(value) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de Término (DD-MM-AAAA)"
              value={extraField.endDate}
              onChangeText={(value) => setExtraField({ ...extraField, endDate: formatDateInput(value) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Deadline (DD-MM-AAAA)"
              value={extraField.deadline}
              onChangeText={(value) => setExtraField({ ...extraField, deadline: formatDateInput(value) })}
            />
          </>
        )}

        <TouchableOpacity onPress={handleCreate} style={styles.button}>
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>

        {selectedItem && (
          <>
            <TouchableOpacity onPress={handleUpdate} style={styles.button}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.button}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

export default CourseSemesterManagement;