import { gql } from '@apollo/client';

export const GET_CONVERSATION = gql`
  query GetConversation($withUserId: Int!) {
    getConversation(withUserId: $withUserId) {
      id
      content
      createdAt
      sender {
        id
        email
        role
        freelancer { nom prenom photo}
        client {nom}
      }
      receiver {
        id
        email
        role 
        freelancer { nom prenom photo}
        client {nom}
      }
    }
  }
`;


export const GET_CONTACTS = gql`
  query GetAvailableContacts {
    getAvailableContacts {
      id
      email
      role
      freelancer { nom prenom photo }
      client { nom  photo }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($createMessageInput: CreateMessageInput!) {
    sendMessage(createMessageInput: $createMessageInput) {
      id
      content
      createdAt
      sender {
        id
        freelancer { nom prenom photo }
        client { nom }
      }
      receiver {
        id
        freelancer { nom prenom photo }
        client { nom }
      }
    }
  }
`;
export const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      email
      role
    }
  }
`;