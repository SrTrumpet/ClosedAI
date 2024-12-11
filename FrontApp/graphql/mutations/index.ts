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

export const ELIMINAR_USUARIO = gql`
    mutation RemoveUser($rut: String!) {
        removeUser(rut: $rut)
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

export const CREATE_COURSE = gql`
  mutation CreateCourse($createCourseDto: CreateCourseDto!) {
    createCourse(createCourseDto: $createCourseDto)
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($updateCourseDto: UpdateCourseDto!) {
    updateCourseDto(updateCourseDto: $updateCourseDto)
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($deleteCourseDto: DeleteCourseDto!) {
    deleteCourseDto(deleteCourseDto: $deleteCourseDto)
  }
`;

export const CREATE_SEMESTER = gql`
  mutation CreateSemester($createSemesterDto: CreateSemesterDto!) {
    createSemester(createSemesterDto: $createSemesterDto)
  }
`;

export const UPDATE_SEMESTER = gql`
  mutation UpdateSemester($updateSemesterDto: UpdateSemesterDto!) {
   updateSemester(updateSemesterDto: $updateSemesterDto)
  }
`;

export const DELETE_SEMESTER = gql`
  mutation DeleteSemester($deleteSemesterDto: DeleteSemesterDto!) {
    deleteSemester(deleteSemesterDto: $deleteSemesterDto)
  }
`;

export const CREATE_FORM = gql`
  mutation CreateForm($createFormInput: CreateFormDto!) {
    createForm(createFormInput: $createFormInput) {
      id
      title
      description
      questions
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FORM = gql`
  mutation RemoveForm($id: ID!) {
    removeForm(id: $id)
  }
`;