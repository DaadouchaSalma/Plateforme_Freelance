import { gql } from "@apollo/client";

export const UPDATE_CLIENT_MUTATION = gql`
  mutation UpdateClient($nom: String, $photo: String, $about: String, $adresse: String, $codePostal: String, $tel: String, $siteweb: String, $domaine: String) {
    updateClient(nom: $nom, photo: $photo, about: $about, adresse: $adresse, codePostal: $codePostal, tel: $tel, siteweb: $siteweb, domaine: $domaine) {
      nom  
      photo
      about
      adresse
      codePostal
      tel
      siteweb
      domaine
    }
  }
`;

export const GET_ALL_CLIENTS_QUERY = gql`
  query GetAllClients {
    allClients {
      nom
      photo
      domaine
      user {
        email
      }
    }
  }
`;

export const GET_CLIENT_BY_ID_QUERY = gql`
  query GetClientById($id: Int!) {
    clientById(id: $id) {
      id
      nom
      photo
      about
      adresse
      codePostal
      tel
      siteweb
      domaine
      user {
        id
        email
      }
    }
  }
`;

export const GET_CURRENT_CLIENT_QUERY = gql`
  query getCurrentClient {
    getCurrentClient {
      id
      nom
      photo
      about
      adresse
      codePostal
      tel
      siteweb
      domaine
      user {
        id
        email
      }
    }
  }
`;

export const REGISTER_CLIENT = gql`
  mutation RegisterClient(
    $email: String!,
    $password: String!,
    $nom: String!,
    $photo: Upload!,
    $adresse: String!,
    $about: String!,
    $codePostal: String!,
    $tel: String!,
    $siteweb: String!,
    $domaine: String!
  ) {
    registerClient(
      email: $email,
      password: $password,
      nom: $nom,
      photo: $photo,
      adresse: $adresse,
      about: $about,
      codePostal: $codePostal,
      tel: $tel,
      siteweb: $siteweb,
      domaine: $domaine
    ) {
      id
      email
    }
  }
`;