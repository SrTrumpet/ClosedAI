import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../../styles/teacher/subjects.styles';
import { clientUser } from '../../graphql/apollo/apolloClient';
import { CREAR_ASIGNATURA, ACTUALIZAR_ASIGNATURA } from '../../graphql/mutations';
import { GET_SUBJECTS } from '../../graphql/queries';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome';

function Subjects() {
  interface Subject {
    id: string;
    name: string;
    numberOfClasses: number;
  }

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [name, setName] = useState('');
  const [numberOfClasses, setNumberOfClasses] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const [tempName, setTempName] = useState('');
  const [tempNumberOfClasses, setTempNumberOfClasses] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingNumberOfClasses, setIsEditingNumberOfClasses] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_SUBJECTS, { client: clientUser });
  const [createSubject] = useMutation(CREAR_ASIGNATURA, { client: clientUser });
  const [updateSubject] = useMutation(ACTUALIZAR_ASIGNATURA, { client: clientUser });

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

    if (!name || numberOfClasses === '') {
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
          createSubjectInput: { name, numberOfClasses: numClasses },
        },
      });

      if (response.data.createSubject) {
        Alert.alert('Asignatura creada con éxito');
        refetch();
        setSelectedSubject(null);
        setName('');
        setNumberOfClasses('');
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
              numberOfClasses: 0
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