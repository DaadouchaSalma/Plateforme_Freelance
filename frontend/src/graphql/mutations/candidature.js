import { gql } from "@apollo/client";

export const CREATE_CANDIDATURE = gql`
  mutation CreateCandidature($input: MinimalCandidatureInput!) {
    createCandidature(input: $input) {
      id
      motivation
      statut
      dateApplication
      freelancer {
        id
        nom
      }
      offer {
        id
        title
      }
      experiences {
        id
        nomSociete
        nomProjet
        dateDebut
        dateFin
        description
      }
    }
  }
`;


export const GET_MY_CANDIDATURES = gql`
  query MyCandidatures {
    myCandidatures {
      id
      motivation
      statut
      dateApplication
      offer {
        id
        title
        description 
        client {  
          id
          nom
        }
        categorie {
        id 
        title
        }
      }
      experiences {
        id
        nomSociete
        nomProjet
        dateDebut  
        dateFin    
        description 
      }
    }
  }
`;

export const GET_CANDIDATURES_BY_OFFRE = gql`
  query CandidaturesByOffre($offreId: Int!) {
    candidaturesByOffre(offreId: $offreId) {
      id
      motivation
      statut
      dateApplication
      freelancer {
        id
        nom
        prenom
        photo
        FreelancerCompetences{
        id
        niveau
        competence{
        id
        nom
        }
      }
      }
      experiences {
        id
        nomSociete
        nomProjet
        dateDebut
        dateFin
        description
      }
    }
  }
`;


export const ACCEPTER_CANDIDATURE = gql`
mutation AccepterCandidature($id: Int!) {
  accepterCandidature(id: $id) {
    id
    statut
  }
}`;

export const REJETER_CANDIDATURE = gql`
mutation RejeterCandidature($id: Int!) {
  rejeterCandidature(id: $id) {
    id
    statut
  }
}`
