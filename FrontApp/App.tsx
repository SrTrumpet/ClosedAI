import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloClientsContext, clientUser } from './graphql/apollo/apolloClient';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPass from './pages/ForgotPass';
import HomeLogin from './pages/HomeLogin';
import DatosUsuario from './pages/padreTutor/datosUsuario';
import ChangePassword from './pages/padreTutor/changePassword'
import DatosHijos from './pages/padreTutor/datosHijos';
import AcademicRecord from './pages/padreTutor/academicRecord';
import Suggestions from './pages/padreTutor/suggestions';
import Subjects from './pages/teacher/Subjects';
import Attendance from './pages/teacher/Attendance';
import Grades from './pages/teacher/Grades';
import Events from './pages/teacher/Events';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloClientsContext.Provider value={{ clientUser }}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} options={{title: 'Registro', headerStyle: {backgroundColor: '#2d6a4f',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeLogin" component={HomeLogin} options={{title: 'Colegio Bajos del Cerro Pequeño', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="DatosUsuario" component={DatosUsuario} options={{title: 'Ver perfil', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{title: 'Cambiar Contraseña', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="DatosHijos" component={DatosHijos} options={{title: 'Datos de los pupilos', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/> 
        <Stack.Screen name="AcademicRecord" component={AcademicRecord} options={{title: 'Expediente académico', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/> 
        <Stack.Screen name="Suggestions" component={Suggestions} options={{title: 'Sugerencias y reclamos', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="Subjects" component={Subjects} options={{title: 'Gestión de asignaturas', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="Attendance" component={Attendance} options={{title: 'Gestión de asistencia', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="Grades" component={Grades} options={{title: 'Calificaciones de estudiantes', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="Events" component={Events} options={{title: 'Calendario de Eventos', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
      </Stack.Navigator>
      </NavigationContainer>
    </ApolloClientsContext.Provider>
  );
}
