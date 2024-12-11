import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation } from '@apollo/client';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CREATE_FORM } from '../../graphql/mutations/index';
import { clientUser } from '../../graphql/apollo/apolloClient';
import styles from '../../styles/padreTutor/suggestions.styles';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const SendFormScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['']);

  const [createForm, { loading, error }] = useMutation(CREATE_FORM, {client: clientUser});

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (text: string, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = text;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (!title || questions.some((q) => q.trim() === '')) {
      Alert.alert('Error', 'Por favor completa todos los campos y preguntas.');
      return;
    }

    const formDescription = description.trim() === '' ? 'Sin descripción' : description;

    try {
      const { data } = await createForm({
        variables: {
          createFormInput: {
            title,
            description: formDescription,
            questions
          }
        }
      });
      Alert.alert('Éxito', `Formulario creado: ${data.createForm.title}`);
      setTitle('');
      setDescription('');
      setQuestions(['']);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleDownload = async () => {
    if (!title || questions.some((q) => q.trim() === '')) {
      Alert.alert('Error', 'Por favor completa todos los campos y preguntas antes de descargar.');
      return;
    }

    const formDescription = description.trim() === '' ? 'Sin descripción' : description;
    const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 0;
          background-color: #f4f4f4;
        }
        h1 {
          font-size: 24px;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
        h3 {
          font-size: 18px;
          color: #444;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        p {
          font-size: 16px;
          color: #555;
          line-height: 1.5;
        }
        ul {
          list-style-type: disc;
          margin-left: 20px;
        }
        li {
          font-size: 16px;
          color: #555;
          margin-bottom: 5px;
        }
        .content {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .description {
          font-style: italic;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <h1>${title}</h1>
        <p class="description"><strong>Descripción:</strong> ${formDescription}</p>
        <h3>Preguntas:</h3>
        <ul>
          ${questions.map(q => `<li>${q}</li>`).join('')}
        </ul>
      </div>
    </body>
  </html>
`;


    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      // Guardar el archivo PDF
      const fileUri = `${FileSystem.documentDirectory}${title}.pdf`;

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Crear Formulario</Text>

          <TextInput
            style={styles.input}
            placeholder="Título del formulario"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Descripción (opcional)"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.subtitle}>Preguntas</Text>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <TextInput
                style={styles.input}
                placeholder={`Pregunta ${index + 1}`}
                value={question}
                onChangeText={(text) => handleQuestionChange(text, index)}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveQuestion(index)}
              >
                <Icon name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleAddQuestion}>
            <Text style={styles.buttonText}>Añadir Pregunta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Crear Formulario'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleDownload}
          >
            <Text style={styles.buttonText}>Descargar Formulario</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SendFormScreen;
