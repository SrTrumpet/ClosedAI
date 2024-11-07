import { gql } from "@apollo/client";

export const INICIO_SESION = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            firstName
            lastName
            rut
            role
            message
        }
    }
`;

export const REGISTRO = gql`
mutation Register($firstName: String!, $lastName: String!, $rut: String!, $email: String!, $password: String!, $role: String!) {
    register(firstName: $firstName, lastName: $lastName, rut: $rut, email: $email, password: $password, role: $role) {
      firstName
      lastName
      role
      message
      token
      role
    }
  }
`;

export const RECUPERAR_CONTRASENA = gql`
mutation ForgotPass($email: String!) {
  forgotPass(email: $email) {
    firstName
    message
    role
    token
  }
}
`;  
  
export const CREAR_USUARIO = gql`
    mutation CreateUser($createUserDto: CreateUserDto!, $rut: String!) {
        createUser(createUserDto: $createUserDto) {
            email
            firstName
            id
            role
            rut
        }
        removeUser(rut: $rut)
    }
`; 

export const ACTUALIZAR_USUARIO = gql`
    mutation UpdateUser($rut: String!, $updateUserDto: UpdateUserDto!) {
        updateUser(rut: $rut, updateUserDto: $updateUserDto) {
        email
        firstName
        lastName
        id
        role
        }
    }
`;

export const CAMBIO_CONTRASENA = gql`
    mutation ChangePassword($newPassword: String!) {
        changePassword(newPassword: $newPassword) {
            token
            message
            verificacion
            role
            firstName
            lastName
            rut
            email
            id
            isChangePassword
        }
    }
`;