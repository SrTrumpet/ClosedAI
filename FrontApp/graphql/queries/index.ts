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
  query GradesByStudentIdAndSubjectId($studentId: Float!, $subjectId: Float!) {
    gradesByStudentIdAndSubjectId(studentId: $studentId, subjectId: $subjectId) {
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

export const GET_ALL_FORMS = gql`
  query GetAllForms {
    forms {
      id
      title
      description
      questions
      createdAt
      updatedAt
    }
  }
`;

export const GET_FORM_BY_ID = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      title
      description
      questions
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_RESPONSES = gql`
  query GetAllResponses {
    getAllResponses {
      id
      formId
      userId
      answers
      submittedAt
    }
  }
`;

export const GET_RESPONSES_BY_FORM_ID = gql`
  query GetResponsesByFormId($formId: Float!) {
    getResponsesByFormId(formId: $formId) {
      id
      formId
      userId
      answers
      submittedAt
    }
  }
`;

export const GET_RESPONSE_BY_ID = gql`
  query GetResponseById($id: Float!) {
    getResponseById(id: $id) {
      id
      formId
      userId
      answers
      submittedAt
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    events {
      id
      creatorId
      courseId
      title
      description
      createdAt
      dueDate
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    event(id: $id) {
      id
      creatorId
      courseId
      title
      description
      createdAt
      dueDate
    }
  }
`;

export const GET_ALL_MESSAGES = gql`
  query GetAllChats {
    chats {
      id
      senderId
      receiverId
      content
      createdAt
    }
  }
`;

export const GET_ALL_MESSAGES_BY_ID = gql`
  query GetChatById($id: ID!) {
    chat(id: $id) {
      id
      senderId
      receiverId
      content
      createdAt
    }
  }
`;