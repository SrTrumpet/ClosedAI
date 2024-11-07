import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloClientsContext, clientUser } from './graphql/apollo/apolloClient';
import styles from './App.styles';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPass from './pages/ForgotPass';
import HomeLogin from './pages/HomeLogin';
import DatosUsuario from './pages/padreTutor/datosUsuario';
import ChangePassword from './pages/padreTutor/changePassword'
import { style } from 'twrnc';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloClientsContext.Provider value={{ clientUser }}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeLogin" component={HomeLogin} options={{ headerShown: false }}/>
        <Stack.Screen name="DatosUsuario" component={DatosUsuario} options={{ headerShown: false }}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{title: 'Cambiar Contraseña', headerStyle: {backgroundColor: '#6a874d',}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold',}, }}/>
      </Stack.Navigator>
      </NavigationContainer>
    </ApolloClientsContext.Provider>
  );
}
