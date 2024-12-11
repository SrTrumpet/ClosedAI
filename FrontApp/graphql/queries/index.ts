import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetAllUser {
    getAllUser {
      id
      firstName
      lastName
      rut
      email
      role
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

export const GET_NEWS = gql`
  query GetAllNotices {
    getAllNotices {
      id
      title
      description
      imageUrl
    }
  }
`;

export const GET_GRADES_BY_SUBJECT = gql`
  query GradesBySubjectId($subjectId: Float!) {
    gradesBySubjectId(subjectId: $subjectId) {
      id
      grade
      studentId
      subjectId
    }
  }
`;

export const GET_GRADES_BY_STUDENT_AND_SUBJECT = gql`
  query GradesByStudentAndSubject($studentId: Float!, $subjectId: Float!) {
    gradesByStudentAndSubject(studentId: $studentId, subjectId: $subjectId) {
      id
      grade
      studentId
      subjectId
    }
  }
`;

export const GET_ALL_COURSES = gql`
  query GetAllCourse {
    getAllCourse{
      id
      nameCourse
	    level
	    subjects{
        name
        numberOfClasses
      }
	  }
  }
`;

export const GET_ALL_SEMESTERS = gql`
  query GetAllSemester {
    getAllSemester{
      id
      nameSemester
      startDate
      endDate
     deadline
	  }
  }
`;