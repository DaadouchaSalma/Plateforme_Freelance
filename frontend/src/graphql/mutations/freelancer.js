import { gql } from "@apollo/client";

export const GET_FREELANCER_BY_ID = gql`
  query GetFreelancerById($id: Int!) {
    freelancerById(id: $id) {
      id
      nom
      prenom
      photo
      bio
      disponibilite
      FreelancerCompetences {
        niveau
        competence {
          id
          nom
        }
      }
      liens {
        id
        url
        type
      }
      user {
        email
      }
    }
  }
`;

export const UPDATE_FREELANCER = gql`
  mutation UpdateFreelancer(
    $nom: String
    $prenom: String
    $bio: String
    $disponibilite: Boolean
    $liensProf: [LienProfInput!]
    $competences: [Int!]
    $niveaux: [String!]
    $photo: Upload
  ) {
    updateFreelancer(
      nom: $nom
      prenom: $prenom
      bio: $bio
      disponibilite: $disponibilite
      liensProf: $liensProf
      competences: $competences
      niveaux: $niveaux
      photo: $photo
    ) {
      id
      nom
      prenom
      bio
      disponibilite
      photo
      liens {
        type
        url
      }
      FreelancerCompetences {
        niveau
        competence {
          id
          nom
        }
      }
    }
  }
`;

export const GET_ALL_FREELANCERS = gql`
  query AllFreelancers {
    allFreelancers {
      id
      nom
      prenom
      photo
      bio
      disponibilite
      FreelancerCompetences {
        niveau
        competence {
          id
          nom
        }
      }
      liens {
        id
        url
        type
      }
    }
  }
`;

export const GET_CURRENT_FREELANCER_QUERY = gql`
  query MeFreelancer {
    meFreelancer {
      id
      nom
      prenom
      photo
      bio
      disponibilite
      FreelancerCompetences {
        niveau
        competence {
          id
          nom
        }
      }
      liens {
        id
        url
        type
      }
    }
  }
`;

export const REGISTER_FREELANCER = gql`
  mutation RegisterFreelancer(
    $email: String!
    $password: String!
    $nom: String!
    $prenom: String!
    $photo: String!
    $bio: String
  ) {
    registerFreelancer(
      email: $email
      password: $password
      nom: $nom
      prenom: $prenom
      photo: $photo
      bio: $bio
    ) {
      id
      email
      role
    }
  }
`;

export const GET_ALL_COMPETENCES = gql`
  query GetCompetences {
    getCompetences {
      id
      nom
      FreelancerCompetences{
      id
      niveau
      }
    }
  }
`;