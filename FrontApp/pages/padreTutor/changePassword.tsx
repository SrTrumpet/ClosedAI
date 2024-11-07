import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from '../../styles/padreTutor/changePassword.styles';
import { CAMBIO_CONTRASENA } from "../../graphql/mutations/index";
import { clientUser } from '../../graphql/apollo/apolloClient';
import { useMutation } from "@apollo/client";
import { useNavigation } from '@react-navigation/native';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changePassword] = useMutation(CAMBIO_CONTRASENA, { client: clientUser });
  const navigation = useNavigation();

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
      return;
    }

    try {
      const { data } = await changePassword({ variables: { newPassword } });
      if (data.changePassword.verificacion) {
        Alert.alert('Éxito', 'Contraseña actualizada correctamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.changePassword.message);
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      Alert.alert('Error', 'No se pudo cambiar la contraseña');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña Actual</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Contraseña actual"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Repetir Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Repetir nueva contraseña"
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={handlePasswordChange} style={styles.button}>
            <Text style={styles.buttonText}>Actualizar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ChangePassword;
