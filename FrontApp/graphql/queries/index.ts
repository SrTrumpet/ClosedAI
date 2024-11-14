import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetAllUser {
    getAllUser {
      id
      firstName
      lastName
      rut
      email
      
    }
  }
`;

export const GET_STUDENTS = gql`
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

export const GET_SUBJECTS = gql`
  query ListSubject {
    listSubject{
      id
      name
      numberOfClasses
      idTeacher
    }
  }
`;

export const GET_ATTENDANCES_BY_SUBJECT = gql`
  query ListUsersBySubject($idSubject: Float!) {
    listUsersBySubject(idSubject: $idSubject) {
      user {
        id
        firstName
        lastName
        rut
      }
      totalAsist
      totalAbsences
    }
  }
`;


export const GET_USER_BY_RUT = gql`
  query FindUserByRut($rut: String!) {
    findByRut(rut: $rut) {
      id
      firstName
      lastName
      rut
      email
      role
    }
  }
`;