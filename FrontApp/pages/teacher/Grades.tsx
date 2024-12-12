import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_GRADE, UPDATE_GRADE, DELETE_GRADE, } from '../../graphql/mutations';
import { GET_SUBJECTS, GET_STUDENTS, GET_ATTENDANCES_BY_SUBJECT, GET_GRADES_BY_SUBJECT } from '../../graphql/queries';
import { clientUser } from '../../graphql/apollo/apolloClient';
import styles from '../../styles/teacher/grades.styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Subject {
  id: number;
  name: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Attendance {
  user: Student;
  totalAsist: number;
}

interface Grade {
  id: number;
  grade: number;
  studentId: number;
  subjectId: number;
  student: Student;
}

function Grades() {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [hasAttendance, setHasAttendance] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<string>('');
  const [currentGradeId, setCurrentGradeId] = useState<number | null>(null);
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);

  const { data: subjectsData } = useQuery(GET_SUBJECTS, { client: clientUser });
  const { data: studentsData } = useQuery(GET_STUDENTS, { client: clientUser });
  const { data: gradesData, loading: loadingGradesQuery, error } = useQuery(GET_GRADES_BY_SUBJECT, {
    variables: { subjectId: subjectId || 0 },
    skip: !subjectId,
    client: clientUser,
  });

  useEffect(() => {
    if (error) {
      console.error('GraphQL error:', error.message);
    }
    // Debug logging
    console.log('Subjects Data:', subjectsData);
    console.log('Students Data:', studentsData);
    console.log('Grades Data:', gradesData);
  }, [error, subjectsData, studentsData, gradesData]);

  const refetchGrades = async () => {
    try {
    await clientUser.refetchQueries({
        include: [GET_GRADES_BY_SUBJECT],
    });
    } catch (error) {
    console.error("Error al refrescar las notas:", error);
    }
};

  const [createGrade] = useMutation(CREATE_GRADE, { client: clientUser });
  const [updateGrade] = useMutation(UPDATE_GRADE, {
    client: clientUser,
    onCompleted: () => {
      refetchGrades();
      setGradeModalVisible(false);
      Alert.alert('Éxito', 'Nota actualizada correctamente');
    },
    onError: (error) => {
      console.error('Error updating grade:', error);
      Alert.alert('Error', 'No se pudo actualizar la nota');
    }
  });

  const [deleteGrade] = useMutation(DELETE_GRADE, {
    client: clientUser,
    onCompleted: () => {
      refetchGrades();
      setDeleteModalVisible(false);
      Alert.alert('Éxito', 'Nota eliminada correctamente');
    },
    onError: (error) => {
      console.error('Error deleting grade:', error);
      Alert.alert('Error', 'No se pudo eliminar la nota');
    }
  });

  const toggleShowGrades = async () => {
    if (!subjectId) {
      Alert.alert('Error', 'Selecciona una asignatura para ver las notas.');
      return;
    }

    if (!showGrades) {
      setLoadingGrades(true);
      try {
        // Si tienes un método de refetch, lo usarías aquí
        // await refetchGrades();
      } catch (error) {
        console.error('Error al consultar las notas:', error);
      } finally {
        setLoadingGrades(false);
      }
    }

    setShowGrades((prevState) => !prevState);
  };

  useEffect(() => {
    const checkAttendance = async () => {
      if (!subjectId || !studentId) {
        console.log('Faltan subjectId o studentId para verificar la asistencia.');
        return;
      }
  
      setLoadingAttendance(true);
      try {
        const { data } = await clientUser.query({
          query: GET_ATTENDANCES_BY_SUBJECT,
          variables: { idSubject: subjectId }, // Asegúrate de usar el nombre correcto aquí
        });
  
        const studentAttendance = data?.listUsersBySubject?.find(
          (record: Attendance) => record?.user?.id === studentId
        );
  
        setHasAttendance(studentAttendance?.totalAsist > 0);
      } catch (error) {
        console.error('Error al verificar la asistencia:', error);
        setHasAttendance(false);
      } finally {
        setLoadingAttendance(false);
      }
    };
  
    checkAttendance();
  }, [subjectId, studentId]);

    

  const handleRegisterGrade = async () => {
    if (!subjectId || !studentId || !grade) {
      Alert.alert('Error', 'Por favor, selecciona todos los campos y una nota válida');
      return;
    }

    if (!hasAttendance) {
      Alert.alert(
        'Error',
        'El estudiante no tiene asistencias registradas en la asignatura seleccionada'
      );
      return;
    }

    const numericGrade = parseFloat(grade.replace(',', '.'));

    if (isNaN(numericGrade) || numericGrade < 1.0 || numericGrade > 7.0) {
      Alert.alert('Error', 'La nota debe estar entre 1.0 y 7.0');
      return;
    }

    try {
      await createGrade({
        variables: {
          createGradeDto: {
            grade: numericGrade,
            studentId: Number(studentId),
            subjectId: Number(subjectId),
          },
        },
      });
      Alert.alert('Nota registrada');
      setGrade('');
      await refetchGrades();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar la nota');
    }
  };

  const handleEditGrade = (grade: Grade) => {
    setCurrentGrade(grade.grade.toString());
    setCurrentGradeId(grade.id);
    setGradeModalVisible(true);
  };

  const handleUpdateGrade = async () => {
    console.log("Update Grade Details:", { 
      currentGradeId, 
      currentGrade 
    });
    if (!currentGradeId || !currentGrade) {
      Alert.alert('Error', 'No se puede actualizar la nota.');
      return;
    }

    const numericGrade = parseFloat(currentGrade.replace(',', '.'));
    if (isNaN(numericGrade) || numericGrade < 1.0 || numericGrade > 7.0) {
      Alert.alert('Error', 'La nota debe estar entre 1.0 y 7.0');
      return;
    }
    try {
      await updateGrade({
        variables: {
          id: Number(currentGradeId),
          updateGradeDto: {grade: parseFloat(currentGrade) },
        },
      });
      Alert.alert('Nota actualizada');
      setGradeModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error al actualizar la nota');
    }
  };

  const handleDeleteGrade = async () => {
    console.log("currentGradeId", currentGradeId);
    if (!currentGradeId) {
      Alert.alert('Error', 'No grade selected for deletion');
      return;
    }
    try {
      await deleteGrade({ variables: { id: Number(currentGradeId) } });
      Alert.alert('Nota eliminada');
      setDeleteModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error al eliminar la nota');
    }
  };

  const handleConfirmDelete = (gradeId: number) => {
    setCurrentGradeId(gradeId);
    setDeleteModalVisible(true);
  };

  const groupGradesByStudent = (grades: Grade[], students: Student[]) => {
    // Validaciones iniciales
    if (!grades || grades.length === 0) return [];
    if (!students || students.length === 0) return [];
  
    // Log para debugging
    console.log('Grades input:', grades);
    console.log('Students input:', students);
  
    const groupedGrades = grades.reduce((acc: any[], grade: Grade) => {
      // Convertir IDs a número para comparación segura
      const gradeStudentId = Number(grade.studentId);
      
      // Encontrar estudiante por ID, con conversión explícita
      const student = students.find((s: Student) => Number(s.id) === gradeStudentId);
  
      if (!student) {
        console.warn(`Estudiante no encontrado para ID: ${gradeStudentId}`);
        return acc;
      }
  
      // Buscar estudiante existente en el acumulador
      const existingStudentIndex = acc.findIndex((s: any) => Number(s.student.id) === gradeStudentId);
  
      if (existingStudentIndex !== -1) {
        // Agregar nota a estudiante existente
        acc[existingStudentIndex].grades.push(grade);
      } else {
        // Crear nueva entrada para estudiante
        acc.push({ 
          student: student, 
          grades: [grade] 
        });
      }
  
      return acc;
    }, []);
  
    console.log('Grouped grades result:', groupedGrades);
    return groupedGrades;
  };
  
  

  // Calcular el promedio de las notas
  const calculateAverage = (grades: number[]) => {
    if (!grades || grades.length === 0) return '0.0';
    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return (total / grades.length).toFixed(2);
  };

  // Crear el encabezado de la tabla dinámicamente según el número de notas
  const TableHeader = ({ maxGrades }: { maxGrades: number }) => {
    const headers = ['Estudiante'];
    for (let i = 1; i <= maxGrades; i++) {
      headers.push(`Nota ${i}`);
    }
    headers.push('Promedio');

    return (
      <View style={[styles.row, styles.tableHeader]}>
        {headers.map((header, index) => (
          <View key={index} style={[styles.cell, { minWidth: 100 }]}>
            <Text style={styles.headerText}>{header}</Text>
          </View>
        ))}
      </View>
    );
  };

  const TableRow = ({ item, maxGrades }: { item: any; maxGrades: number }) => {
    const grades = item.grades || [];
    while (grades.length < maxGrades) {
      grades.push(''); // Completar con celdas vacías
    }
  
    const average = grades.length
      ? calculateAverage(grades.filter((g: Grade | null) => g !== null).map((g: Grade) => g.grade))
      : '0.0';
  
    return (
      <View style={[styles.row, { backgroundColor: '#ffffff' }]}>
        {/* Columna con el nombre del estudiante */}
        <View style={[styles.cell, { minWidth: 140 }]}>
          <Text style={styles.cellText}>{`${item.student.firstName} ${item.student.lastName}`}</Text>
        </View>
        {/* Columnas con las notas */}
        {grades.map((gradeObj: Grade | null, index: number) => (
        <View key={index} style={[styles.cell, { minWidth: 100 }]}>
          <Text style={getCellStyle(gradeObj?.grade ?? '')}>
              {gradeObj ? gradeObj.grade : ''}
          </Text>
          {gradeObj && (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => handleEditGrade(gradeObj)}
                style={{ marginHorizontal: 5 }}
              >
                <Icon name="edit" size={20} color="#6a874d" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleConfirmDelete(gradeObj.id)}
                style={{ marginHorizontal: 5 }}
              >
                <Icon name="delete" size={20} color="#d9534f" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <View style={[styles.cell, { minWidth: 100 }]}>
        <Text style={getCellStyle(parseFloat(average))}>{average}</Text>
      </View>
    </View>
    );
  };
  

  // Renderizar la tabla de notas con comprobaciones de seguridad
  const renderGradesTable = () => {
    if (loadingGrades) {
      return <ActivityIndicator size="large" color="#6a874d" />;
    }

    if (!gradesData?.gradesBySubjectId?.length) {
      return <Text style={styles.noDataText}>No hay notas para mostrar.</Text>;
    }

    // Agrupar las notas por estudiante
    const studentsWithGrades = groupGradesByStudent(gradesData.gradesBySubjectId, studentsData.getAllStudents);
    console.log('Students with grades:', studentsWithGrades );
    // Determinar el número máximo de notas para un estudiante
    const maxGrades = studentsWithGrades.length 
      ? Math.max(...studentsWithGrades.map((s: any) => s.grades.length))
      : 0;

    return (
      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <TableHeader maxGrades={maxGrades} />
            {maxGrades > 0 && (
              <FlatList
                data={studentsWithGrades}
                keyExtractor={(item) => item.student?.id?.toString() || 'default'}
                renderItem={({ item }) => <TableRow item={item} maxGrades={maxGrades} />}
                scrollEnabled={true}
                nestedScrollEnabled={true}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderEditGradeModal = () => (
    <Modal
      visible={gradeModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setGradeModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Editar Nota</Text>
          <TextInput
            value={currentGrade}
            onChangeText={setCurrentGrade}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Ingrese nueva nota"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={handleUpdateGrade} 
              style={[styles.button, styles.buttonConfirm]}
            >
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setGradeModalVisible(false)} 
              style={[styles.button, styles.buttonCancel]}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDeleteConfirmModal = () => (
    <Modal
      visible={deleteModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setDeleteModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
          <Text style={styles.modalText}>¿Está seguro de eliminar esta nota?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={handleDeleteGrade} 
              style={[styles.button, styles.buttonDelete]}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setDeleteModalVisible(false)} 
              style={[styles.button, styles.buttonCancel]}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const getCellStyle = (grade: number | string) => {
    if (typeof grade !== 'number') return styles.cellText; // Default style for blank cells
    return grade < 4.0 ? styles.cellTextRed : styles.cellTextGreen;
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Notas</Text>

        {/* Modal para seleccionar asignatura */}
        <TouchableOpacity onPress={() => setSubjectModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>
            {selectedSubject ? selectedSubject.name : 'Selecciona una asignatura'}
          </Text>
        </TouchableOpacity>

        <Modal visible={subjectModalVisible} transparent onRequestClose={() => setSubjectModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={subjectsData?.listSubject || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }: { item: Subject }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedSubject(item);
                      setSubjectId(Number(item.id));
                      setSubjectModalVisible(false);
                    }}
                    style={styles.modalButton}
                  >
                    <Text style={styles.subjectButtonText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Modal para seleccionar estudiante */}
        <TouchableOpacity onPress={() => setStudentModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>
            {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Selecciona un estudiante'}
          </Text>
        </TouchableOpacity>

        <Modal visible={studentModalVisible} transparent onRequestClose={() => setStudentModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={studentsData?.getAllStudents || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }: { item: Student }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedStudent(item);
                      setStudentId(item.id);
                      setStudentModalVisible(false);
                    }}
                    style={styles.modalButton}
                  >
                    <Text style={styles.subjectButtonText}>{`${item.firstName} ${item.lastName}`}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <TextInput
          placeholder="Nota"
          value={grade}
          onChangeText={setGrade}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity
          onPress={handleRegisterGrade}
          style={[styles.button, (!subjectId || !studentId || !grade) && styles.buttonDisabled]}
          disabled={!subjectId || !studentId || !grade}
        >
          <Text style={styles.buttonText}>Registrar Nota</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleShowGrades} style={styles.button}>
          <Text style={styles.buttonText}>{showGrades ? 'Ocultar Notas' : 'Ver Notas'}</Text>
        </TouchableOpacity>

        {showGrades && (
          <>
            <Text style={styles.title}>Historial de Notas</Text>
            {renderGradesTable()}
          </>
        )}
        {renderEditGradeModal()}
        {renderDeleteConfirmModal()}

      </View>
    </ScrollView>
  );
}

export default Grades;