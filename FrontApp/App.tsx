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
import StudentGrades from './pages/padreTutor/studentGrades';
import StudentAttendance from './pages/padreTutor/studentAttendance';
import AcademicRecord from './pages/padreTutor/academicRecord';
import Suggestions from './pages/padreTutor/suggestions';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloClientsContext.Provider value={{ clientUser }}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeLogin" component={HomeLogin} options={{title: 'Colegio Bajos del Cerro Pequeño', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="DatosUsuario" component={DatosUsuario} options={{title: 'Ver perfil', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{title: 'Cambiar Contraseña', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="DatosHijos" component={DatosHijos} options={{title: 'Datos de los pupilos', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/> 
        <Stack.Screen name="StudentGrades" component={StudentGrades} options={{title: 'Calificaciones del estudiante', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="StudentAttendance" component={StudentAttendance} options={{title: 'Asistencia del estudiante', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
        <Stack.Screen name="AcademicRecord" component={AcademicRecord} options={{title: 'Expediente académico', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/> 
        <Stack.Screen name="Suggestions" component={Suggestions} options={{title: 'Sugerencias y reclamos', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
      </Stack.Navigator>
      </NavigationContainer>
    </ApolloClientsContext.Provider>
  );
}
