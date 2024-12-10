import React, { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as SecureStore from 'expo-secure-store';
import styles from '../../styles/teacher/events.styles';

function Events() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await SecureStore.getItemAsync('userName');
        const lastName = await SecureStore.getItemAsync('userLastName');
        const rut = await SecureStore.getItemAsync('userRut');
        const email = await SecureStore.getItemAsync('userEmail');
        const role = await SecureStore.getItemAsync('userRole');
      } catch (error) {
        console.error('Error al obtener datos de SecureStore:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.subtitle}>Calendario</Text>
          <Calendar
            onDayPress={handleDayPress}
            enableSwipeMonths={true}
            firstDay={1} // Inicia la semana en lunes
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

        {/* Modal para Fecha Seleccionada */}
        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Fecha seleccionada: {selectedDate}</Text>
              <Text style={styles.noDataText}>No hay eventos disponibles para esta fecha.</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Events;
