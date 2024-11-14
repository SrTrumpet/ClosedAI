import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { REGISTRAR_ASISTENCIA } from '../../graphql/mutations';
import { GET_ATTENDANCES_BY_SUBJECT, GET_SUBJECTS, GET_USER_BY_RUT } from '../../graphql/queries';
import { clientUser } from '../../graphql/apollo/apolloClient';
import * as SecureStore from 'expo-secure-store';
import styles from '../../styles/teacher/attendance.styles';

interface Subject {
  id: number;
  name: string;
  numberOfClasses: number;
}

interface AttendanceRecord {
    user: {
      id: string;
      rut: string;
      firstName: string;
      lastName: string;
    };
    totalAsist: number;
    totalAbsences: number;
  }

function Attendance() {
  const [rut, setRut] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { data: subjectsData, loading: loadingSubjects, error, refetch } = useQuery(GET_SUBJECTS, { client: clientUser });
  const { data: userData, refetch: refetchUser } = useQuery(GET_USER_BY_RUT, {
    variables: { rut },
    client: clientUser,
    skip: !rut,
  });
  const [registrarAsistencia] = useMutation(REGISTRAR_ASISTENCIA, { client: clientUser });
  const { data: attendanceData, refetch: refetchAttendance, loading: loadingAttendance } = useQuery(
    GET_ATTENDANCES_BY_SUBJECT,
    { client: clientUser, variables: { idSubject: subjectId }, skip: !subjectId, }
  );

  useEffect(() => {
    const getTokenAndRole = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      const role = await SecureStore.getItemAsync('userRole');
      setToken(token || null);
      setUserRole(role || null);
    };
    getTokenAndRole();
  }, []);

  const handleAttendance = async () => {
    if (!subjectId || !rut) {
      Alert.alert('Error', 'Selecciona una asignatura e ingresa el RUT del estudiante');
      return;
    }
    console.log("DATOS USUARIO: ", userData);
    if (!userData || userData.findByRut.role !== 'Student') {
      Alert.alert('Error', 'El RUT ingresado no corresponde a un estudiante');
      return;
    }
    
   
    try {
      await registrarAsistencia({
        variables: {
          createAsistInput: {
            asistencias: [{ idUser: parseInt(userData.findByRut.id), idSubject: Number(subjectId), asist: 1 }],
          },
        },
      });
      Alert.alert('Asistencia registrada');
      refetchAttendance();
      setRut('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la asistencia');
      console.error(error);
    }
  };

  const handleSearch = () => {
    if (!rut) {
      Alert.alert('Error', 'Por favor, ingresa un RUT');
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
    setRut(formattedRut);
    refetchUser();
  };

  const TableHeader = () => (
    <View style={[styles.row, styles.tableHeader]}>
      <View style={[styles.cell, { minWidth: 140 }]}>
        <Text style={styles.headerText}>RUT</Text>
      </View>
      <View style={[styles.cell, { minWidth: 200 }]}>
        <Text style={styles.headerText}>Nombre</Text>
      </View>
      <View style={[styles.cell, { minWidth: 100 }]}>
        <Text style={styles.headerText}>Asist.</Text>
      </View>
      <View style={[styles.cell, { minWidth: 100 }]}>
        <Text style={styles.headerText}>Faltas</Text>
      </View>
      <View style={[styles.cell, { minWidth: 100 }]}>
        <Text style={styles.headerText}>%</Text>
      </View>
    </View>
  );
  
  const getMaxAttendance = (records: AttendanceRecord[]): number => {
    if (!records || records.length === 0) return 0;
    return Math.max(...records.map(record => record.totalAsist));
  };

  const TableRow = ({ item, maxAttendance }: { item: AttendanceRecord; maxAttendance: number }) => {
    const adjustedAbsences = maxAttendance - item.totalAsist;
    const attendancePercentage = maxAttendance > 0 
      ? ((item.totalAsist / maxAttendance) * 100).toFixed(1) 
      : "0.0";
    
    return (
      <View style={[styles.row, { backgroundColor: '#ffffff' }]}>
        <View style={[styles.cell, { minWidth: 140 }]}>
          <Text style={styles.cellText}>{item.user.rut}</Text>
        </View>
        <View style={[styles.cell, { minWidth: 200 }]}>
          <Text style={styles.cellText}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
        </View>
        <View style={[styles.cell, { minWidth: 100 }]}>
          <Text style={styles.cellText}>{item.totalAsist}</Text>
        </View>
        <View style={[styles.cell, { minWidth: 100 }]}>
          <Text style={styles.cellText}>{adjustedAbsences}</Text>
        </View>
        <View style={[styles.cell, { minWidth: 100 }]}>
          <Text style={styles.cellText}>{attendancePercentage}%</Text>
        </View>
      </View>
    );
  };

  const renderAttendanceHistory = () => {
    if (loadingAttendance) {
      return <ActivityIndicator size="large" color="#6a874d" />;
    }

    if (!attendanceData?.listUsersBySubject?.length) {
      return <Text style={styles.noDataText}>No hay datos de asistencia para mostrar.</Text>;
    }

    const maxAttendance = getMaxAttendance(attendanceData.listUsersBySubject);

    return (
      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <TableHeader />
            <FlatList
              data={attendanceData.listUsersBySubject}
              keyExtractor={(item) => item.user.id?.toString() || Math.random().toString()}
              renderItem={({ item }) => <TableRow item={item} maxAttendance={maxAttendance} />}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            />
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      {userRole === 'teacher' && (
          <>
        <Text style={styles.title}>Registro de Asistencia</Text>

        {loadingSubjects ? (
          <ActivityIndicator size="large" color="#6a874d" />
        ) : (
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
              <Text style={styles.buttonText}>
                {selectedSubject ? selectedSubject.name : "Selecciona una asignatura"}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={modalVisible}
              transparent
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  {subjectsData?.listSubject.map((subject: Subject) => (
                    <TouchableOpacity
                      key={subject.id.toString()}
                      onPress={() => {
                        setSelectedSubject(subject);
                        setSubjectId(parseFloat(subject.id.toString()));
                        setModalVisible(false);
                      }}
                      style={[styles.modalButton]}
                    >
                      <Text style={styles.subjectButtonText}>{subject.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
                </View>
                
            </Modal>
            </>
        )}
          </>
        )}
        
        {userRole === 'teacher' && (
          <>
            <TextInput
            placeholder="RUT del Estudiante"
            value={rut}
            onChangeText={formatoRUT}
            style={styles.input}
            />
            <TouchableOpacity onPress={handleAttendance} style={styles.button}>
            <Text style={styles.buttonText}>Registrar Asistencia</Text>
            </TouchableOpacity>
          </>
        )}
        
            <Text style={styles.title}>Historial de Asistencia</Text>
            <TouchableOpacity onPress={() => setAttendanceModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>Ver Asistencia</Text>
            </TouchableOpacity>

        <Modal
          visible={attendanceModalVisible}
          transparent
          onRequestClose={() => setAttendanceModalVisible(false)}
        >
          <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {subjectsData?.listSubject.map((subject: Subject) => (
                <TouchableOpacity
                  key={subject.id.toString()}
                  onPress={() => {
                    setSelectedSubject(subject);
                    setSubjectId(parseFloat(subject.id.toString()));
                    setAttendanceModalVisible(false);
                    setShowAttendanceHistory(true);
                    refetchAttendance();
                  }}
                  style={[styles.modalButton]}
                >
                  <Text style={styles.subjectButtonText}>{subject.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
            </View>
        </Modal>

        {showAttendanceHistory && (
        <View style={styles.tableContainer}>
            <TouchableOpacity onPress={() => setShowAttendanceHistory(false)} style={[styles.button, { marginBottom: 10 }]}>
            <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
            {renderAttendanceHistory()}
        </View>
        )}

      </View>
    </ScrollView>
  );
}

export default Attendance;