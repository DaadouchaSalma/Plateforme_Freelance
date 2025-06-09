import { gql } from "@apollo/client";


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