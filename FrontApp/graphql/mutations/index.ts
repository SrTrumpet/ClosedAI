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
  mutation CreateUser($createUserDto: CreateUserDto!) {
    createUser(createUserDto: $createUserDto) {
      id
      firstName
      lastName
      rut
      email
      role
    }
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

export const CAMBIAR_CONTRASENA = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword) {
      message
    }
  }
`;

export const CREAR_ASIGNATURA = gql`
  mutation Mutation($createSubjectInput: CreateSubjectDto!) {
    createSubject(createSubjectInput: $createSubjectInput) {
      isCreateSubject
    }
  }
`;

export const ACTUALIZAR_ASIGNATURA = gql`
  mutation Mutation($updateSubjectInput: UpdateSubjectDto!) {
    updateSubject(updateSubjectInput: $updateSubjectInput) {
      id
      name
      numberOfClasses
      idTeacher
    }
  }
`;

export const REGISTRAR_ASISTENCIA = gql`
  mutation TakeAsist($createAsistInput: CreateAsistDto!) {
    takeAsist(createAsistInput: $createAsistInput)
  }
`;

export const CREAR_ANUNCIO = gql`
  mutation CreateNotice($title: String!, $description: String!, $imageUrl: String) {
    createNotice(title: $title, description: $description, imageUrl: $imageUrl) {
      isCreateNotice
    }
  }
`;

export const CREATE_GRADE = gql`
  mutation CreateGrade($createGradeDto: CreateGradeDto!) {
    createGrade(createGradeDto: $createGradeDto) {
      id
      grade
      studentId
      subjectId
    }
  }
`;

export const UPDATE_GRADE = gql`
  mutation UpdateGrade($id: Float!, $updateGradeDto: UpdateGradeDto!) {
    updateGrade(id: $id, updateGradeDto: $updateGradeDto) {
      id
      grade
      studentId
      subjectId
    }
  }
`;

export const DELETE_GRADE = gql`
  mutation DeleteGrade($id: Float!) {
    deleteGrade(id: $id)
  }
`;