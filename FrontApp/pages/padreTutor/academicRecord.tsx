import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_STUDENTS, GET_SUBJECTS, GET_ATTENDANCES_BY_SUBJECT, GET_GRADES_BY_STUDENT_AND_SUBJECT } from '../../graphql/queries';
import { clientUser } from '../../graphql/apollo/apolloClient';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/padreTutor/academicRecord.styles';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

function AcademicRecord() {
  const [selectedUser, setSelectedUser] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [gradesData, setGradesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Obtener lista de estudiantes
  const { data: studentsData, loading: studentsLoading } = useQuery(GET_STUDENTS, {
    client: clientUser,
  });

  // Obtener lista de asignaturas
  const { data: subjectsData, loading: subjectsLoading } = useQuery(GET_SUBJECTS, {
    client: clientUser,
  });

  // Fetch attendance data for selected student
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!selectedUser || !subjectsData) return;

      setIsLoading(true);
      try {
        const attendancePromises = subjectsData.listSubject.map(async (subject: any) => {
          try {
            const { data } = await clientUser.query({
              query: GET_ATTENDANCES_BY_SUBJECT,
              variables: { idSubject: parseFloat(subject.id) }
            });


            const attendanceRecord = data.listUsersBySubject.find(
              (record: any) => record.user.id === selectedUser.id
            );

            return {
              subject,
              attendance: attendanceRecord || { totalAsist: 0, totalAbsences: 0 }
            };
          } catch (error) {
            console.error(`Error fetching attendance for subject ${subject.id}:`, error);
            return {
              subject,
              attendance: { totalAsist: 0, totalAbsences: 0 }
            };
          }
        });

        const results = await Promise.all(attendancePromises);
        
        // Filtrar asignaturas con asistencias mayores a 0
        const filteredResults = results.filter(
          ({ attendance }) => attendance.totalAsist > 0 || attendance.totalAbsences > 0
        );

        setAttendanceData(filteredResults);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedUser, subjectsData]);

  useEffect(() => {
    const fetchGradesData = async () => {
      if (!selectedUser || !subjectsData) return;

      setIsLoading(true);
      try {
        const gradesPromises = subjectsData.listSubject.map(async (subject: any) => {
          
          try {
            const { data } = await clientUser.query({
              query: GET_GRADES_BY_STUDENT_AND_SUBJECT,
              variables: { studentId: parseFloat(selectedUser.id), subjectId: parseFloat(subject.id) }
            });
            
            return {
              subject,
              grades: data.gradesByStudentIdAndSubjectId || []
            };
          } catch (error) {
            console.error(`Error fetching grades for subject ${subject.id}:`, error);
            return {
              subject,
              grades: []
            };
          }
        });

        const results = await Promise.all(gradesPromises);
        const filteredResults = results.filter(({ grades }) => grades.length > 0);
        setGradesData(filteredResults);
        } catch (error) {
          console.error('Error fetching grades data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGradesData();
  }, [selectedUser, subjectsData]);


  if (studentsLoading || subjectsLoading) {
    return <ActivityIndicator size="large" color="#6a874d" />;
  }

  if (!studentsData || !subjectsData) {
    return <Text style={styles.noDataText}>Error al cargar los datos.</Text>;
  }

  const calculateAverage = (grades: number[]) => {
    if (!grades || grades.length === 0) return '0.0';
    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return (total / grades.length).toFixed(2);
  };

  const getMaxAttendance = (data: any[]): number => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(item => item.attendance.totalAsist));
  };

  const calculatePercentage = (attendances: number, absences: number) =>
    attendances + absences > 0
      ? ((attendances / (attendances + absences)) * 100).toFixed(1)
      : '0.0';


      const TableHeader = ({ maxGrades }: { maxGrades: number }) => {
        const headers = ['Asignatura'];
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
        const grades = item.grades.map((g: any) => g.grade) || [];
        while (grades.length < maxGrades) {
          grades.push(''); // Completar con celdas vacías
        }
    
        const average = grades.length
          ? calculateAverage(grades.filter((g: any) => g !== '').map(parseFloat))
          : '0.0';
    
        return (
          <View style={[styles.row, { backgroundColor: '#ffffff' }]}>
            <View style={[styles.cell, { minWidth: 140 }]}>
              <Text style={styles.cellText}>{item.subject.name}</Text>
            </View>
            {grades.map((grade: any, index: number) => (
              <View key={index} style={[styles.cell, { minWidth: 100 }]}>
                <Text style={getCellStyle(parseFloat(grade))}>
                  {typeof grade === 'number' ? grade.toFixed(1) : ''}
                </Text>
              </View>
            ))}
            <View style={[styles.cell, { minWidth: 100 }]}>
              <Text style={getCellStyle(parseFloat(average))}>{average}</Text>
            </View>
          </View>
        );
      };

      const getCellStyle = (grade: number | string) => {
        if (typeof grade !== 'number') return styles.cellText; // Default style for blank cells
        return grade < 4.0 ? styles.cellTextRed : styles.cellTextGreen;
      };

      
      const calculateAverageOfSubject = (grades: number[]) => {
        if (!grades || grades.length === 0) return 0;
        const total = grades.reduce((sum, grade) => sum + grade, 0);
        return total / grades.length;
      };
      
      const calculateGeneralAverage = (subjects: any[]) => {
        // Calcula el promedio de cada asignatura y luego calcula el promedio de esos promedios
        const subjectAverages = subjects.map((subject) => {
          const subjectGrades = subject.grades.map((g: any) => g.grade);
          return calculateAverageOfSubject(subjectGrades);
        });
      
        const totalAverage = subjectAverages.reduce((sum, avg) => sum + avg, 0);
        return (totalAverage / subjectAverages.length).toFixed(2); // Redondear a 2 decimales
      };
      
      const getGeneralAverageColor = (average: number) => {
        return average < 4 ? styles.cellTextRed : styles.cellTextGreen;
      };

      const renderGradesTable = () => {
        if (isLoading) {
          return <ActivityIndicator size="large" color="#6a874d" />;
        }
    
        if (gradesData.length === 0) {
          return <Text style={styles.noDataText}>No hay notas para mostrar.</Text>;
        }
    
        const maxGrades = gradesData.length
          ? Math.max(...gradesData.map((s: any) => s.grades.length))
          : 0;

          const allSubjects = gradesData.map((s: any) => s);
          const generalAverage = calculateGeneralAverage(allSubjects);
    
        return (
          <View style={styles.tableContainer2}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                <TableHeader maxGrades={maxGrades} />
                {maxGrades > 0 && (
                  <FlatList
                    data={gradesData}
                    keyExtractor={(item) => item.subject.id.toString()}
                    renderItem={({ item }) => <TableRow item={item} maxGrades={maxGrades} />}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                  />
                )}
              </View>
            </ScrollView>
            <View style={[styles.row, styles.totalRow]}>
        <View style={styles.cellContainer}>
          <Text style={[styles.cellBold, getGeneralAverageColor(parseFloat(generalAverage))]}>
            Promedio General: {generalAverage}
          </Text>
        </View>
      </View>
        </View>
        
        );
      };
    
    

const renderTable = () => {
  if (!selectedUser) {
    return null;
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color="#6a874d" />;
  }

  if (attendanceData.length === 0) {
    return <Text style={styles.noDataText}>No hay asistencia disponible para el estudiante</Text>;
  }

  const totalsWithAdjustedAttendance = attendanceData.map(({ subject, attendance }) => {
    // Encuentra el máximo de asistencias para esta asignatura específica
    const maxAttendanceForSubject = Math.max(...attendanceData.map(
      item => item.attendance.totalAsist
    ));

    const adjustedAbsences = maxAttendanceForSubject - attendance.totalAsist;
    const percentage = calculatePercentage(attendance.totalAsist, adjustedAbsences);

    return {
      subject,
      attendance: {
        ...attendance,
        adjustedAbsences,
        percentage
      }
    };
  });

  // Calcular totales generales
  const totals = totalsWithAdjustedAttendance.reduce(
    (acc, { attendance }) => ({
      attendances: acc.attendances + attendance.totalAsist,
      absences: acc.absences + attendance.adjustedAbsences
    }),
    { attendances: 0, absences: 0 }
  );

  const totalPercentage = calculatePercentage(totals.attendances, totals.absences);
  
  return (
    <View style={styles.tableContainer}>
      <View style={[styles.row, styles.tableHeader]}>
        <View style={styles.cellContainer}><Text style={[styles.cell, styles.headerText]}>Asignatura</Text></View>
        <View style={styles.cellContainer}><Text style={[styles.cell, styles.headerText]}>Asistencias</Text></View>
        <View style={styles.cellContainer}><Text style={[styles.cell, styles.headerText]}>Faltas</Text></View>
        <View style={styles.cellContainer}><Text style={[styles.cell, styles.headerText]}>Porcentaje</Text></View>
      </View>

      {totalsWithAdjustedAttendance.map(({ subject, attendance }) => (
        <View style={styles.row} key={subject.id}>
          <View style={styles.cellContainer}><Text style={styles.cellText}>{subject.name}</Text></View>
          <View style={styles.cellContainer}><Text style={styles.cellText}>{attendance.totalAsist}</Text></View>
          <View style={styles.cellContainer}><Text style={styles.cellText}>{attendance.adjustedAbsences}</Text></View>
          <View style={styles.cellContainer}>
            <Text
              style={[
                styles.cellText,
                { color: parseFloat(attendance.percentage) < 80 ? '#ff4d4d' : '#4CAF50' },
              ]}
            >
              {attendance.percentage}%
            </Text>
          </View>
        </View>
      ))}

      <View style={[styles.row, styles.totalRow]}>
        <View style={styles.cellContainer}><Text style={styles.cellBold}>Totales</Text></View>
        <View style={styles.cellContainer}><Text style={styles.cellBold}>{totals.attendances}</Text></View>
        <View style={styles.cellContainer}><Text style={styles.cellBold}>{totals.absences}</Text></View>
        <View style={styles.cellContainer}>
          <Text
            style={[
              styles.cellBold,
              { color: parseFloat(totalPercentage) < 80 ? '#ff4d4d' : '#4CAF50' },
            ]}
          >
            {totalPercentage}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const generatePdfContent = () => {
  if (!selectedUser || (!attendanceData.length && !gradesData.length)) return '';

  const maxGrades = gradesData.length
  ? Math.max(...gradesData.map((s: any) => s.grades.length))
  : 0;
  const totalsWithAdjustedAttendance = attendanceData.map(({ subject, attendance }) => {
    const maxAttendanceForSubject = Math.max(...attendanceData.map(
      item => item.attendance.totalAsist
    ));

    const adjustedAbsences = maxAttendanceForSubject - attendance.totalAsist;
    const percentage = calculatePercentage(attendance.totalAsist, adjustedAbsences);

    return {
      subject,
      attendance: {
        ...attendance,
        adjustedAbsences,
        percentage
      }
    };
  });

  const totals = totalsWithAdjustedAttendance.reduce(
    (acc, { attendance }) => ({
      attendances: acc.attendances + attendance.totalAsist,
      absences: acc.absences + attendance.adjustedAbsences
    }),
    { attendances: 0, absences: 0 }
  );

  // Calcular porcentaje total de asistencia
  const totalPercentage = calculatePercentage(totals.attendances, totals.absences);

  const attendanceTableRows = totalsWithAdjustedAttendance.map(({ subject, attendance }) => {
    const attendanceColor = parseFloat(attendance.percentage) < 80 ? '#ff4d4d' : '#4CAF50';
    return `
      <tr>
        <td>${subject.name}</td>
        <td>${attendance.totalAsist}</td>
        <td>${attendance.adjustedAbsences}</td>
        <td style="color: ${attendanceColor};">${attendance.percentage}%</td>
      </tr>
    `;
  }).join('');

  const totalAttendanceRow = `
    <tr style="background-color: #f4f4f4; font-weight: bold;">
      <td>Total de Asistencia</td>
      <td>${totals.attendances}</td>
      <td>${totals.absences}</td>
      <td style="color: ${parseFloat(totalPercentage) < 80 ? '#ff4d4d' : '#4CAF50'};">
        ${totalPercentage}%
      </td>
    </tr>
  `;

  const calculateGeneralAverage = (subjects: any[]) => {
    const subjectAverages = subjects.map((subject) => {
      const subjectGrades = subject.grades.map((g: { grade: any; }) => g.grade);
      return calculateAverageOfSubject(subjectGrades);
    });

    const totalAverage = subjectAverages.reduce((sum: any, avg: any) => sum + avg, 0);
    return (totalAverage / subjectAverages.length).toFixed(2);
  };
  const generalAverage = calculateGeneralAverage(gradesData);

  const gradesTableRows = gradesData.map(({ subject, grades }) => {
    const gradesColumns = Array(maxGrades).fill('').map((_, index) => {
      const grade = grades[index];
      if (grade) {
        const gradeColor = parseFloat(grade.grade) < 4.0 ? 'red' : 'green';
        return `<td style="color: ${gradeColor};">${grade.grade}</td>`;
      }
      return '<td>-</td>';
    }).join('');

    const average = calculateAverage(grades.map((g: { grade: any; }) => g.grade));
    const averageColor = parseFloat(average) < 4.0 ? 'red' : 'green';

    return `
      <tr>
        <td>${subject.name}</td>
        ${gradesColumns}
        <td style="color: ${averageColor};">${average}</td>
      </tr>
    `;
  }).join('');

  const generalAverageRow = `
    <tr style="background-color: #f4f4f4;">
      <td><strong>Promedio General</strong></td>
      ${Array(maxGrades).fill('<td>-</td>').join('')}
      <td style="color: ${parseFloat(generalAverage) < 4.0 ? 'red' : 'green'};">
        <strong>${generalAverage}</strong>
      </td>
    </tr>
  `;

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            position: relative;
          }
          .school-header {
            position: absolute;
            top: -40;
            left: 0;
            padding: 10px;
            background-color: rgba(106, 135, 77, 0.1);
            border-bottom: 2px solid rgba(106, 135, 77, 0.3);
            border-right: 2px solid rgba(106, 135, 77, 0.3);
            border-radius: 0 0 10px 0;
            font-weight: bold;
            color: #4a5f36;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 14px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
          }
          h1 {
            margin-top: 100px; /* Aumenta el espacio superior */
            text-align: center;
            color: #333;
          }
          h2 {
            margin-top: 30px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #777;
          }
         </style>
      </head>
      <body>
        <div class="school-header">
          Colegio Bajos del Cerro Pequeño
        </div>
        <h1>Informe Académico de ${selectedUser.firstName} ${selectedUser.lastName}</h1>

        <h2>Asistencias</h2>
        <table>
          <thead>
            <tr>
              <th>Asignatura</th>
              <th>Asistencias</th>
              <th>Faltas</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            ${attendanceTableRows}
            ${totalAttendanceRow}
          </tbody>
        </table>

        <h2>Notas</h2>
        <table>
          <thead>
            <tr>
              <th>Asignatura</th>
              ${Array(maxGrades).fill('').map((_, index) => `<th>Nota ${index + 1}</th>`).join('')}
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            ${gradesTableRows}
            ${generalAverageRow}
          </tbody>
        </table>

        <div class="footer">
          <p>Para más información, contactarse con su docente en la sección "Ver sugerencias o reclamos"</p>
        </div>
      </body>
    </html>
  `;
};

const generatePdf = async () => {
  const htmlContent = generatePdfContent();

  
  try {
    // Crear el PDF desde el contenido HTML
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
    });

    // Guardar el archivo PDF
    const fileUri = `${FileSystem.documentDirectory} Informe de Notas.pdf`;

    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });

    // Compartir el archivo PDF
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Guardar formulario como PDF',
    });
    
    Alert.alert('PDF generado', 'Formulario guardado como PDF.');
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    Alert.alert('Error', 'No se pudo generar el archivo PDF.');
  }
};

  return (
    <View style={styles.container}>
      {!selectedUser ? (
        <>
          <Text style={styles.title}>Seleccione un estudiante</Text>
          <FlatList
            data={studentsData.getAllStudents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ width: '100%' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => setSelectedUser(item)}
              >
                <Text style={styles.userItemText}>{item.firstName} {item.lastName}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Asistencias de {selectedUser.firstName} {selectedUser.lastName}
          </Text>
          {renderTable()}
          <Text style={styles.subtitle}>
            Notas de {selectedUser.firstName} {selectedUser.lastName}
          </Text>
          {renderGradesTable()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setSelectedUser(null)}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={generatePdf}>
              <Text style={styles.buttonText}>Generar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('Suggestions' as never)}
            >
              <Text style={styles.buttonText} >Justificaciones o Reclamos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default AcademicRecord;