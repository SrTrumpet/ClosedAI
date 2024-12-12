import { gql } from "@apollo/client";




export interface Student {
    id: string;
    rut: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "Student" | "Teacher" | "Admin" | "Parents";
    isPresent: boolean;
  }
  
  export interface ListUsersBySubjectData {
    listUsersBySubject: {
      user: {
        id: string;
        firstName: string;
        lastName: string;
        rut: string;
        email: string;
        role: "Student" | "Teacher" | "Admin" | "Parents";
      };
      totalAsist: number;
      totalAbsences: number;
    }[];
  }
  
  export interface ListUsersBySubjectVars {
    idSubject: number;
  }
  

export const INICIO_SESION = gql`
    query InicioSesion {
        veriUser {
            email
            pass
        }
    }
`;

export const Mensaje = gql`
    query InicioSesion {
        mensaje
    }
`;


export const OBTENER_INFO = gql`
    query{
        conseguirInformacionUsuario{
            nombre
            correo
        }
    }
`;


export const LISTAR_CURSOS = gql`
    query ListSubject {
      listSubject {
        id
        name
        numberOfClasses
      }
    }
`;

export const LIST_USERS_BY_SUBJECT = gql`
  query ListUsersBySubject($idSubject: Float!) {
    listUsersBySubject(idSubject: $idSubject) {
      user {
        id
        firstName
        lastName
        rut
        email
        role
      }
      totalAsist
      totalAbsences
    }
  }
`;

export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      id
      firstName
      lastName
      rut
      email
      role
    }
  }
`;



export const GET_ALL_USERS = gql`
  query GetAllUser {
    getAllUser {
      email
      firstName
      id
      lastName
      role
      rut
    }
  }
`;





export const FIND_BY_RUT = gql`
  query FindByRut($rut: String!) {
    findByRut(rut: $rut) {
        id
        firstName
        lastName
        rut
        role
    }
  }
`;


export const GRADES_BY_SUBJECT_ID = gql`
  query GradesBySubjectId($subjectId: Float!) {
    gradesBySubjectId(subjectId: $subjectId) {
      id
      grade
      studentId
    }
  }
`;

export const CREATE_NOTICE = gql`
  mutation CreateNotice($title: String!, $description: String!, $imageUrl: String) {
    createNotice(title: $title, description: $description, imageUrl: $imageUrl) {
      isCreateNotice
    }
  }
`;


export const GET_ALL_NOTICES = gql`
  query GetAllNotices {
    getAllNotices {
      id
      title
      description
      imageUrl
    }
  }
`;



export const GET_MESSAGES = gql`
  query GetMessages($senderId: Int!, $recipientId: Int!) {
    getMessages(senderId: $senderId, recipientId: $recipientId) {
      id
      content
      timestamp
      sender {
        id
        firstName
        lastName
      }
      recipient {
        id
        firstName
        lastName
      }
    }
  }
`;